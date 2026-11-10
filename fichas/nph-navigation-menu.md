---
piece: nph-navigation-menu
level: component
status: active
solves: >-
  Gives a product its main navigation in a horizontal bar: direct links and triggers that open a
  panel of grouped links, with the page the person is on marked by more than color.
use_when:
  - "For the main and stable sections of a product or site, always visible at the top."
  - "A trigger when the section has inner pages; a top link when it goes straight to one page."
  - "Two labeled groups in a panel when it puts together links of different kinds."
  - "narrow when the items do not fit on one line: the bar turns into the Menu button, which opens the same items as a vertical list."
do_not_use_when:
  - "For actions on an object, such as delete: navigation goes to pages and does not change data; use nph-dropdown-menu."
  - "As an application command bar (menubar): the piece is disclosure navigation, with no arrow-key menubar pattern."
  - "To switch content on the same page: use tabs."
  - "As side navigation with several levels: use the sidebar."
  - "To hide the bar behind the Menu button when the items fit: menus hidden away reduce the discovery of the sections."
api:
  items:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The top items of the bar, in order. A link item is { label, href } and
      a trigger item is { type: trigger, label, groups }, with an optional value that names it
      for active. Each group is { label, links } and each link is { title, href, description,
      icon, current, disabled }. label and title are required, already localized, on one line.
      href is required on every link, unless it is disabled, and takes http, https, mailto, tel or
      a relative address; any other protocol, javascript among them, in any spelling the browser
      reads as such, is refused. icon is optional, a core name of nph-icon. A list that is not a
      list or is empty, a trigger without groups, a group without links, two triggers with the
      same value or a link that breaks a rule above draws nothing and emits console.error in
      development, one per cause. How many items, groups and links there are is composition.
  narrow:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      It is the Figma value `estreita` of the property `largura`. On, the bar turns into the Menu
      button, which opens the same items as a vertical list, where each trigger is a collapsed row
      that opens its links below it; it needs menu-label, and without it the piece draws nothing and
      emits console.error in development. The consumer chooses it, since the width is the page to
      know. Reflects so the consumer can style and check the state. Which rows are open is internal:
      there is no attribute for it.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      It is the Figma value `sim` of the property `aberto`. Wide, the panel of the active trigger is
      shown; narrow, the vertical list is shown. The piece turns it on and off, and the consumer may
      set it. Reflects. A bar that changes width while open closes.
  active:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The value of the trigger whose panel open shows. A trigger without a value has its index in
      items, as text. Empty or unknown: open shows the first trigger that is not disabled. A click on
      a trigger writes it.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the navigation landmark, already localized. It wins over the
      aria-label of the host. A bar with neither draws and warns once in development.
  menu-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the Menu button, already localized, such as Menu. Required when
      narrow, because the icon has no text. Not read when the bar is wide.
  aria-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the landmark when label is not given; label wins over it. It is read
      by a property whose attribute is aria-label, since a property called ariaLabel is the native
      ARIA reflection of the element. A bar with neither draws and warns once in development.
variants:
  width:
    axis: appearance
    choose_when: "Wide (the Figma `larga`) when the items fit on one line; narrow (`estreita`) when they do not, or on a narrow screen."
    do_not_combine_with: ["narrow without menu-label"]
  item:
    axis: appearance
    choose_when: "A trigger (the Figma `gatilho`) when the section has inner pages; a top link (`link`) when it goes straight to one page."
    do_not_combine_with: ["a trigger without groups", "a group without links", "a link without href that is not disabled"]
  icon:
    axis: appearance
    choose_when: "An icon on a panel link (the Figma `ícone` yes) when it helps to recognize the page; without it (`não`) when the title is enough."
    do_not_combine_with: ["an icon that does not belong to the core of nph-icon"]
states:
  top-rest:
    token: "navigation-menu/trigger-foreground"
    changes_for_user: "The top item shows its text, with no background. A trigger carries the arrow."
  top-hover:
    token: "navigation-menu/trigger-background-hover, navigation-menu/trigger-foreground-hover"
    changes_for_user: "The top item takes a background and the accent text. A trigger whose panel is open keeps this look."
  top-focus:
    token: "focus/border, focus/halo"
    changes_for_user: "For keyboard users, a border and a halo outside the item mark the focus; the item keeps the look of rest."
  top-disabled:
    token: "state/disabled-opacity"
    changes_for_user: "The whole item loses opacity. It takes no hover and no focus."
  top-current:
    token: "navigation-menu/current-foreground, navigation-menu/current-indicator-background, navigation-menu/current-indicator-width"
    changes_for_user: "The text takes the current color and a bar under the item marks the page, so color is not the only signal. Focus adds the border and the halo."
  link-rest:
    token: "navigation-menu/item-title-foreground, navigation-menu/item-description-foreground, navigation-menu/item-icon-foreground"
    changes_for_user: "The panel link shows its title, its optional description and its optional icon, with no background."
  link-hover:
    token: "navigation-menu/item-background-hover, navigation-menu/item-title-foreground-hover, navigation-menu/item-icon-foreground-hover"
    changes_for_user: "The link takes a background, the accent title and the accent icon."
  link-focus:
    token: "focus/border, focus/halo"
    changes_for_user: "For keyboard users, a border and a halo outside the link mark the focus."
  link-disabled:
    token: "state/disabled-opacity"
    changes_for_user: "The whole link loses opacity. It takes no hover and no focus."
  link-current:
    token: "navigation-menu/current-foreground, navigation-menu/current-indicator-background, navigation-menu/current-indicator-width"
    changes_for_user: "The title and the icon take the current color and a bar at the start of the link marks the page; the icon is solid."
business_rules:
  - "A menu has one current page: at most one link is current. A trigger shows as current when its panel holds the current link."
  - "A trigger opens its panel on click, Enter or Space. With the mouse, it opens after motion/hover-delay and closes after navigation-menu/close-delay once the pointer leaves the trigger and the panel; the panel stays open while the pointer is over it, and a pointer that comes back within the close delay keeps it open. A click on a panel the pointer opened keeps it open."
  - "The trigger arrow turns half a turn when its panel opens, and back when it closes. The panel fades in on motion/enter-duration and motion/enter-easing and out on motion/exit-duration and motion/exit-easing, and leaves the top layer when the exit ends. With reduced motion nothing moves: no turn and no fade, and the state changes at once."
  - "Esc closes the panel and gives the focus back to its trigger. A click outside, and the focus leaving the bar, close it. Following a link closes it."
  - "Disclosure navigation, not a menubar: Tab moves between the items and into the open panel, Enter and Space open and close. There are no arrow keys."
  - "The wide panel hugs its content; the narrow panel and every panel link are navigation-menu/panel-width wide. Two groups sit side by side, with a vertical nph-separator between them."
  - "The panel opens navigation-menu/panel-offset below its trigger, aligned to its start edge, and never leaves the window sideways."
  - "narrow turns the bar into the Menu button, which opens the same items as a vertical list. The top links stay plain links and come together. The consumer chooses narrow; the piece does not measure itself."
  - "In the narrow list each trigger is a collapsed row with its arrow. A click, Enter or Space on the row opens its links below it and turns the arrow; each row opens and closes on its own, with no exclusivity. The links of a collapsed row are hidden: out of the accessibility tree and of the Tab order. Every row starts collapsed each time the list opens. A disabled trigger is a disabled row that opens nothing."
  - "The trigger arrow and the panel link icon are decorative. Light is the style of the icon, solid marks the current panel link."
  - "The piece has no slot, no event and no featured card inside the panel, and only one level of panels."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "An items that is not a list or is empty; an item or a link without label or title; a link without href that is not disabled, or with an unsafe protocol: the piece draws nothing and emits console.error in development, one per cause."
  - "A trigger without groups, a group without links, or two triggers with the same value: the piece draws nothing and emits console.error in development."
  - "An icon outside the core of nph-icon; more than one current link: the piece draws nothing and emits console.error in development."
  - "A narrow bar without menu-label: the piece draws nothing and emits console.error in development."
  - "A bar with no accessible name draws and warns once in development, because the name may arrive after the first render."
tokens:
  top_item: "navigation-menu/trigger-foreground, navigation-menu/trigger-background-hover, navigation-menu/trigger-foreground-hover, navigation-menu/trigger-padding-x, navigation-menu/trigger-padding-y, navigation-menu/trigger-gap, navigation-menu/trigger-radius, navigation-menu/trigger-icon-size"
  bar: "navigation-menu/bar-gap"
  pointer: "navigation-menu/close-delay, motion/hover-delay"
  motion: "motion/enter-duration, motion/enter-easing, motion/exit-duration, motion/exit-easing"
  panel: "navigation-menu/panel-background, navigation-menu/panel-border, navigation-menu/panel-border-width, navigation-menu/panel-radius, navigation-menu/panel-padding, navigation-menu/panel-width, navigation-menu/panel-offset, navigation-menu/group-gap, elevation/dropdown"
  panel_link: "navigation-menu/item-background-hover, navigation-menu/item-title-foreground, navigation-menu/item-title-foreground-hover, navigation-menu/item-description-foreground, navigation-menu/item-padding, navigation-menu/item-gap, navigation-menu/item-text-gap, navigation-menu/item-radius, navigation-menu/item-icon-size, navigation-menu/item-icon-foreground, navigation-menu/item-icon-foreground-hover"
  current: "navigation-menu/current-foreground, navigation-menu/current-indicator-background, navigation-menu/current-indicator-width"
  focus: "focus/border, border/width, focus/halo, focus/ring-width, focus/border-radius-control, focus/radius-control-with-border, focus/border-radius-inner, focus/radius-inner-with-border"
  disabled: state/disabled-opacity
  typography: "text/label-md, text/label-sm, text/body-sm"
  menu_button: "the secondary ghost tokens of nph-icon-button, control/height-default, radius/control"
ai_hints:
  - "Use nph-navigation-menu for the main sections of a product, always visible at the top; for actions on an object use nph-dropdown-menu, for tabs use tabs, for side navigation use the sidebar."
  - "Give items as a list: a link item has label and href, a trigger item has label and groups, and each group has links with title and href."
  - "Use a trigger only when the section has inner pages; a section that goes straight to one page is a top link."
  - "Mark the page the person is on with current on its link, only one in the whole menu; never mark the current page by color alone."
  - "Group the panel links with a group label when they are of different kinds."
  - "Give the bar a label, or an aria-label, because it is the accessible name of the navigation landmark."
  - "Choose narrow when the items do not fit on one line, and then give menu-label; the piece does not measure itself."
accessibility:
  semantics: "A nav, named. Each trigger is a native button with aria-expanded and aria-controls pointing to its panel; the link of the current page carries aria-current page, and a trigger that holds it carries aria-current true. The panel is part of the page's Tab order, right after its trigger. In the narrow list the trigger is a native button row with aria-expanded and aria-controls pointing to the region with its links, which is hidden while the row is collapsed. The arrow and the link icons are decorative and hidden from assistive technology. A panel link is named by its content, the title and the description. The Menu button is a native button with an accessible name and aria-expanded."
  accessible_name: "The landmark: label, else the aria-label of the host. A trigger: its label. A link: its content, the title and the optional description. The Menu button: menu-label, because its icon has no text."
  keyboard:
    - "Tab moves between the top items and, when a panel is open, through its links, which come right after their trigger."
    - "Enter and Space on a trigger open or close its panel; Enter follows a link."
    - "In the narrow list, Tab moves through the rows and through the links of the rows that are open; Enter and Space on a row open or close it."
    - "Esc closes the open panel and gives the focus back to its trigger, or to the Menu button."
    - "There are no arrow keys: this is disclosure navigation, not a menubar."
  focus: "Keyboard only, on the top item, the panel link and the Menu button: a border of border/width in focus/border and a halo in focus/halo outside the box, without changing its size. The border carries the focus; the halo is reinforcement. A disabled item takes no focus."
  contrast: "The text of the top items and of the panel links, the description and the icons pass the required WCAG level over the background in both themes and in the seven brands, the current text included: navigation-menu/current-foreground is color/primary-text. The indicator and the focus border, in the primary color, have at least 3:1 against the background in both schemes."
  color_alternative: "The current page is told apart without color: the indicator comes with the current text color (WCAG 1.4.1). The open trigger shows its panel and the hover background, and the arrow turns."
invalid_combinations:
  - "narrow without menu-label — the Menu button has an icon and no text."
  - "A trigger without groups or a group without links — the panel would be empty."
  - "More than one current link — a menu has one current page."
  - "A link without href that is not disabled, or with an unsafe protocol."
  - "An icon outside the core of nph-icon."
  - "Two triggers with the same value."
relations:
  combines_with: [nph-icon, nph-separator, nph-tooltip]
  parents: ["the top of the page, in the header of a product or site"]
  children: [nph-icon, nph-separator, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the menu for actions on an object, such as delete."
  - "Marking the current page by color alone."
  - "Hiding the bar behind the Menu button when the items fit."
  - "Opening a trigger for a section that has no inner pages."
  - "Putting a featured card or a second level of panels inside the panel."
  - "Leaving the bar without a label or an aria-label."
sources:
  design_md: "design.md, the navigation-menu/* tokens, color/primary-surface, color/accent-foreground, color/popover, color/dropdown-border, elevation/dropdown and the global focus/* tokens"
  decision: "P110 — nph-navigation-menu: API and semantics"
  tests: "src/components/nph-navigation-menu/nph-navigation-menu.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-navigation-menu/nph-navigation-menu.stories.ts and nph-navigation-menu.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-navigation-menu documentation 3977:7913, sets 3969:7897, 3957:6662 and 3957:6722"
---

# nph-navigation-menu

## Function

**The problem it solves:** gives a product its main navigation in a horizontal bar. Direct links
and triggers sit side by side, and a trigger opens a panel with the links of its section, grouped.
The page the person is on is marked by more than color.

**When to use:**

- For the main and stable sections of a product or site, always visible at the top.
- A trigger when the section has inner pages; a top link when it goes straight to one page.
- Two labeled groups in a panel when it puts together links of different kinds.
- `narrow` when the items do not fit on one line: the bar turns into the Menu button, which opens
  the same items as a vertical list.

**When NOT to use:**

- **For actions on an object, such as delete** — navigation goes to pages and does not change
  data; use `nph-dropdown-menu`.
- **As an application command bar (menubar)** — the piece is disclosure navigation, with no
  arrow-key menubar pattern.
- **To switch content on the same page** — use tabs.
- **As side navigation with several levels** — use the sidebar.
- **To hide the bar behind the Menu button when the items fit** — menus hidden away reduce the
  discovery of the sections.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Width | Wide, `narrow` | Wide when the items fit on one line; `narrow` when they do not, or on a narrow screen |
| Top item | Trigger, link | A trigger when the section has inner pages; a link when it goes straight to one page |
| Panel link icon | Without, with | With an icon when it helps to recognize the page; without it when the title is enough |

The width is the Figma property `largura`, with the values `larga` (wide) and `estreita`
(narrow), and the open state is the property `aberto`, with `não` (no) and `sim` (yes), which the
code reads from `open`. The top item is the Figma set with the properties `tipo`, with the values
`gatilho` (trigger) and `link`, and `state`, with `default`, `hover-aberto` (hover or open trigger),
`hover`, `foco` (focus), `disabled`, `atual` (current) and `atual-foco` (current in focus), and the
text `rótulo` (label). The panel link is the set with the properties `ícone` (icon), with `não` and
`sim`, and `state`, with `default`, `hover`, `foco`, `disabled`, `atual` and `atual-foco`, and the
texts `título` (title), `descrição` (description) and `mostrar descrição` (show description), which the
code reads from `title` and `description` of each link.

**By size and density:** `not_applicable`. The bar has a single size, with the label in Noto Sans.

**Do not combine with:** `narrow` without `menu-label`; a trigger without groups; a group without
links; a link without `href` that is not disabled.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Top item | Rest | `navigation-menu/trigger-foreground` | The text, with no background; a trigger carries the arrow |
| Top item | Hover, open trigger | `navigation-menu/trigger-background-hover`, `navigation-menu/trigger-foreground-hover` | A background and the accent text; the open trigger keeps this look |
| Top item | Focus | `focus/border`, `focus/halo` | For keyboard users, a border and a halo outside the item |
| Top item | Disabled | `state/disabled-opacity` | The whole item loses opacity; no hover, no focus |
| Top item | Current | `navigation-menu/current-foreground`, `navigation-menu/current-indicator-background` | The current text color and a bar under the item |
| Panel link | Rest | `navigation-menu/item-title-foreground`, `navigation-menu/item-description-foreground`, `navigation-menu/item-icon-foreground` | The title, the optional description and the optional icon |
| Panel link | Hover | `navigation-menu/item-background-hover`, `navigation-menu/item-title-foreground-hover`, `navigation-menu/item-icon-foreground-hover` | A background, the accent title and the accent icon |
| Panel link | Focus | `focus/border`, `focus/halo` | For keyboard users, a border and a halo outside the link |
| Panel link | Disabled | `state/disabled-opacity` | The whole link loses opacity; no hover, no focus |
| Panel link | Current | `navigation-menu/current-foreground`, `navigation-menu/current-indicator-background` | The current color on the title and the solid icon, and a bar at the start of the link |

The current item in focus is the Figma state `atual-foco`: it keeps the current text and the
indicator and adds the focus border and halo. A current item does not change on hover: the contract
has no hover state for it.

**Feedback and focus:** focus shows only for keyboard users and **is not removed**. The top item,
the panel link and the Menu button show the same two layers outside the box, a border and a halo,
without changing its size. The current page is never told by color alone.

**Business rule the piece carries:**

- A menu has one current page. A trigger shows as current when its panel holds the current link.
- A trigger opens on click, Enter or Space. With the mouse it opens after `motion/hover-delay` and
  closes after `navigation-menu/close-delay` once the pointer leaves the trigger and the panel; a
  pointer that comes back within the close delay keeps it open. A click on a panel the pointer
  opened keeps it open.
- The trigger arrow turns half a turn when its panel opens and back when it closes. The panel fades
  in on `motion/enter-*` and out on `motion/exit-*` and leaves the top layer when the exit ends.
  With reduced motion nothing moves: no turn and no fade.
- Esc closes the panel and gives the focus back to its trigger. A click outside, the focus leaving
  the bar and following a link close it.
- It is disclosure navigation, not a menubar: Tab and Enter, no arrow keys.
- The wide panel hugs its content; the narrow panel and every panel link are
  `navigation-menu/panel-width` wide. Two groups sit side by side with a vertical `nph-separator`.
- `narrow` is the consumer's choice, and the Menu button opens the same items as a vertical list.
  In it each trigger is a collapsed row with its arrow: a click, Enter or Space opens its links below
  it and turns the arrow. Each row opens and closes on its own, and the links of a collapsed row are
  hidden, out of the Tab order and of the accessibility tree. The top links stay plain links.
- There is no featured card in the panel, and there is a single level of panels.
- Every text comes from the consumer, already localized.

**Domain error states:** an invalid `items`, a trigger or group that breaks its rule, a link
without `href`, an unsafe `href`, an icon outside the core, more than one current link or a narrow
bar without `menu-label` draws nothing and emits `console.error` in development, one per cause. A
bar with no accessible name draws and warns once in development.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A `nav`, named. Each trigger is a native `button` with `aria-expanded` and `aria-controls`; the link of the current page carries `aria-current="page"` and a trigger that holds it `aria-current="true"`. The panel comes right after its trigger in the Tab order. In the narrow list the trigger is a native `button` row with `aria-expanded` and `aria-controls` pointing to the region with its links, which is `hidden` while the row is collapsed. The arrow and the link icons are decorative. A panel link is named by its content, the title and the description |
| Accessible name | The landmark: `label`, else the `aria-label` of the host. A trigger: its label. A link: its content, the title and the optional description. The Menu button: `menu-label` |
| Keyboard | Tab moves between the items and through the links of an open panel. Enter and Space open and close a trigger; Enter follows a link; Esc closes the panel and gives the focus back. In the narrow list Tab moves through the rows and through the links of the rows that are open, and Enter and Space open and close a row. There are no arrow keys |
| Focus | Keyboard only, on the top item, the panel link and the Menu button: a border of `border/width` in `focus/border` and a halo in `focus/halo` outside the box, without changing its size. A disabled item takes no focus |
| Contrast | The text, the description and the icons pass the required WCAG level in both themes and in the seven brands, the current text included (`navigation-menu/current-foreground` is `color/primary-text`). The indicator and the focus border, in the primary color, have at least 3:1 against the background in both schemes |
| Alternative to color | The current page has the indicator besides the current text color (WCAG 1.4.1). The open trigger shows the panel and the hover background, and its arrow turns |
| Motion | The arrow turns and the panel fades on `motion/enter-*` and `motion/exit-*`. With `prefers-reduced-motion: reduce` nothing moves: no turn and no fade, and the panel leaves the top layer at once |
| Touch target | The top items and the Menu button exceed 24 by 24; the Menu button is `control/height-default` square |
| Known limits | (a) The Menu button is a native `button` that replicates the tokens of the secondary ghost `nph-icon-button`, because `nph-button` does not pass `aria-expanded` to its inner button (P110). (b) The contract has the current state for a trigger and does not say who sets it; the piece derives it from the current link in its panel (D-2). (c) The piece does not measure itself: the consumer chooses `narrow` |

## Relations

**Combines with:** `nph-icon`, which draws the trigger arrow, the link icons and the Menu button
icon, `nph-separator`, which divides the groups and the sections, and `nph-tooltip`, which carries
the name of the Menu button. The group label is drawn as the group label of `nph-dropdown-menu`.

**What is the parent:** the top of the page, in the header of a product or site. It does not replace
an application command bar, tabs or the sidebar.

**What is the child:** `nph-icon`, `nph-separator` and, on the Menu button, `nph-tooltip`, drawn by
the piece. The top item and the panel link are inner pieces, not tags of their own.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Top item | `navigation-menu/trigger-foreground`, `navigation-menu/trigger-background-hover`, `navigation-menu/trigger-foreground-hover`, `navigation-menu/trigger-padding-x`, `navigation-menu/trigger-padding-y`, `navigation-menu/trigger-gap`, `navigation-menu/trigger-radius`, `navigation-menu/trigger-icon-size` |
| Bar | `navigation-menu/bar-gap` |
| Pointer | `navigation-menu/close-delay` (the wait before a panel closes), `motion/hover-delay` (the wait before it opens) |
| Motion | `motion/enter-duration`, `motion/enter-easing`, `motion/exit-duration`, `motion/exit-easing` |
| Panel | `navigation-menu/panel-background`, `navigation-menu/panel-border`, `navigation-menu/panel-border-width`, `navigation-menu/panel-radius`, `navigation-menu/panel-padding`, `navigation-menu/panel-width`, `navigation-menu/panel-offset`, `navigation-menu/group-gap`, `elevation/dropdown` |
| Panel link | `navigation-menu/item-background-hover`, `navigation-menu/item-title-foreground`, `navigation-menu/item-title-foreground-hover`, `navigation-menu/item-description-foreground`, `navigation-menu/item-padding`, `navigation-menu/item-gap`, `navigation-menu/item-text-gap`, `navigation-menu/item-radius`, `navigation-menu/item-icon-size`, `navigation-menu/item-icon-foreground`, `navigation-menu/item-icon-foreground-hover` |
| Current | `navigation-menu/current-foreground`, `navigation-menu/current-indicator-background`, `navigation-menu/current-indicator-width` |
| Focus | `focus/border`, `border/width`, `focus/halo`, `focus/ring-width`, `focus/border-radius-control`, `focus/radius-control-with-border`, `focus/border-radius-inner`, `focus/radius-inner-with-border` |
| Disabled | `state/disabled-opacity` |
| Typography | `text/label-md`, `text/label-sm`, `text/body-sm` |
| Menu button | The secondary ghost tokens of `nph-icon-button`, `control/height-default`, `radius/control` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything
comes from a token. It has no slot, no event, no `::part` and no color property.

**AI hints:**

- Use `nph-navigation-menu` for the main sections of a product, always visible at the top; for
  actions on an object use `nph-dropdown-menu`, for tabs use tabs, for side navigation use the
  sidebar.
- Give `items` as a list: a link item has `label` and `href`, a trigger item has `label` and
  `groups`, and each group has `links` with `title` and `href`.
- Use a trigger only when the section has inner pages; a section that goes straight to one page is
  a top link.
- Mark the page the person is on with `current` on its link, only one in the whole menu; never
  mark the current page by color alone.
- Group the panel links with a group label when they are of different kinds.
- Give the bar a `label`, or an `aria-label`, because it is the accessible name of the navigation
  landmark.
- Choose `narrow` when the items do not fit on one line, and then give `menu-label`; the piece
  does not measure itself.

## Examples

**Recommended case:** a closed bar with two triggers and the link of the current page; a trigger
open, with a panel of two groups of links, each with its title, description and icon.

**Alternative case:** the narrow width, with the Menu button open and the vertical list: each
trigger a collapsed row with its arrow, one row open with its links, the current link marked.

## Anti-patterns

- **Do not use the menu for actions on an object, such as delete** — use `nph-dropdown-menu`.
- **Do not mark the current page by color alone** — use `current`, which brings the indicator.
- **Do not hide the bar behind the Menu button when the items fit.**
- **Do not open a trigger for a section that has no inner pages** — use a top link.
- **Do not put a featured card or a second level of panels inside the panel.**
- **Do not leave the bar without a name** — give `label` or `aria-label`.
- **Invalid combinations:** `narrow` without `menu-label`; a trigger without groups; a group
  without links; more than one current link; a link without `href` that is not disabled.
- **Do not create without a decision:** a featured card, a menubar pattern, more than one level of
  panels, a collapse by width done by the piece.

## Sources and decisions

- **The repository `design.md`:** the `navigation-menu/*` tokens, the colors they point to and the
  global `focus/*` tokens.
- **The decision that originated it:** P110.
- **Tests:** `src/components/nph-navigation-menu/nph-navigation-menu.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-navigation-menu/nph-navigation-menu.stories.ts` and
  `nph-navigation-menu.docs.stories.ts`.
- **Figma:** the `nph-navigation-menu` documentation frame (`3977:7913`), the sets `3969:7897`,
  `3957:6662` and `3957:6722` in `DS-IA-NEPHOS 5.0`.
