---
piece: nph-sidebar
level: component
status: active
solves: >-
  Shows the main navigation of a product in a column on the left, in three modes (expanded,
  collapsed and mobile) and two states (ready and loading), so the person knows where they are
  and changes area with one click, with a flyout panel for the second level of the collapsed
  menu and for the third level, or, in the panel menu navigation, with the third level opening in
  place.
use_when:
  - "For the main navigation of a product: one column on the left, with its areas and their pages."
  - "In the expanded mode, on a wide screen, when the names of the areas help the person to choose."
  - "In the collapsed mode, when the content needs the width: the rail shows the icons with a balloon, and an item with children opens a flyout panel next to it; the rail button of the group that holds the current page shows the active look."
  - "In the mobile mode, on a narrow screen: the menu opens over the screen, with the scrim behind, and closes with the close button."
  - "With loading, while the list of the product is still arriving."
  - "With the corner button, for the main action of the product, such as All applications."
  - "With the panel menu navigation, for a system with many destinations in up to three levels, where the person needs to see the whole path without leaving the column."
do_not_use_when:
  - "For the tabs inside a page: use nph-tabs."
  - "For the actions of a button: use nph-dropdown-menu."
  - "For the top navigation: use nph-navigation-menu."
  - "For the page trail: use nph-breadcrumb."
  - "For the account of the person: it belongs to the product header, not to the menu."
  - "For a page action, such as save, filter or export, in the corner button: use nph-button in the page bar."
  - "The collapsed mode on a phone: use the mobile mode."
  - "The panel menu with two levels or fewer than five destinations: use the flyout navigation, which is the default."
api:
  mode:
    type: enum
    values: [expanded, collapsed, mobile]
    required: false
    default: expanded
    reflects: true
    constraint: >-
      The Figma `modo`. expanded shows the full logo, the search and the names; collapsed shows the
      logo mark, the collapse button, the rail buttons and the corner button as an icon; mobile is
      the expanded menu over the screen. The product chooses it and switches to mobile below the md
      breakpoint; the collapse button also switches expanded and collapsed. Reflects because the CSS
      reads it. Any other value draws nothing and emits console.error in development.
  navigation:
    type: enum
    values: [flyout, panel-menu]
    required: false
    default: flyout
    reflects: false
    constraint: >-
      How the third level opens (task DSA-76, P124). flyout is the navigation of the first version: the
      subitem with options opens its panel at the side. panel-menu draws the same items as an accordion
      whose third level opens in place, below its subgroup; the panel menu is a mode of this tag, not a
      new one. It changes the expanded and the mobile list; the collapsed menu is the rail with its
      flyout panels in both. Any other value draws nothing and emits console.error in development. It
      does not reflect: the CSS reads the markup the panel menu draws, not the host.
  open:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The mobile menu opened. Only in mobile mode. The product opens it with a button of its own and
      the menu sets it to false when the person closes it. Setting it from code fires nothing.
  loading:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma `estado` `carregando`. nph-skeleton rows in place of the items, with aria-busy on the
      list. The logo, the search and the corner button stay.
  items:
    type: array
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      The entries, in order, as data (property only). A label entry ({ type: label, text }) names
      the group that follows it. A link (type absent or link) has label, icon and href and optionally
      active, counter, disabled, tooltip, actions, actionsLabel and value. A group (type group) has
      label, icon and children, and optionally expanded, disabled, tooltip, actions, actionsLabel and
      value. A child has label and href, or options (the third level, each with label and href);
      active, disabled, tooltip and value, and expanded in the panel menu. Two levels in the list; the
      third in a flyout panel, or in place in the panel menu, where a child with options is a subgroup.
      In the flyout navigation the menu replaces the list when a group opens or closes and never
      changes the objects of the consumer. In the panel menu the open groups and subgroups are the
      person's and the menu keeps them, so a new list does not undo them: the group that holds the
      current page is born open, once; an expanded the product writes seeds a group, and a new value
      wins. An entry that cannot be drawn is left out and emits console.error in development, once per
      cause. An empty list is a mount.
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the navigation landmark, already localized, such as Main menu. Empty
      draws the menu and emits one console.error in development.
  logo-src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The address of the full logo, an image of the brand library that Nephos does not export. It
      has no dark version yet (task DSA-72, D-2). Empty draws no logo.
  logo-mark-src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The address of the logo mark of the collapsed mode. Empty uses logo-src.
  logo-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The name of the product. It is the accessible name of the logo link, or the alternative text of
      the logo when it has no logo-href.
  logo-href:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The page the logo leads to. Empty draws the logo as an image, not as a link.
  search-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the search. The search is drawn, in the expanded and mobile modes, only
      with it. It is an nph-input.
  search-placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The hint inside the search, already localized.
  search-value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text in the search. The menu writes it as the person types and fires nph-search-change.
  collapse-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the collapse button while the menu is expanded, such as Collapse menu.
      Required while the button is shown; without it the button is not drawn and the menu emits
      console.error in development.
  expand-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the collapse button while the menu is collapsed, such as Expand menu.
      Required while the button is shown.
  close-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the close button of the mobile menu. Required in mobile mode; without
      it the button is not drawn and the menu emits console.error in development.
  corner-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The main action of the product, such as All applications. It is the text of the corner button in
      the expanded and mobile modes and its accessible name in the collapsed mode. Empty draws no
      corner button.
  hide-collapse-button:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The Figma `botão de recolher`, on by default. Turns the collapse button off.
  hide-corner-button:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The Figma `botão do canto`, on by default. Turns the corner button off.
  empty-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The short message in place of the list when there are no items, already localized. Empty draws
      nothing.
  error-text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The short message in place of the list when the list could not load, already localized. It is an
      alert and wins over the items.
  nph-mode-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person switches the menu with the collapse button, with detail.mode, the new
      mode. It bubbles and crosses shadow roots. The product keeps the mode. Setting mode from code
      fires nothing.
  nph-close:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired before the mobile menu closes when the person asks, with detail.source: close-button,
      escape or scrim. It bubbles, crosses shadow roots and is cancelable: preventDefault keeps the
      menu open. Setting open from code fires nothing.
  nph-group-toggle:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person opens or closes a group of the expanded list or, in the panel menu, a
      subgroup, with detail.value, the value of the group or of the child, and detail.expanded, the new
      state. It bubbles and crosses shadow roots.
  nph-search-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired as the person types in the search, with detail.value. It bubbles and crosses shadow roots.
  nph-corner-action:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person presses the corner button. It bubbles and crosses shadow roots.
  nph-item-select:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The action the person chose in the more actions of an item, fired again on the host with
      detail.value, detail.checked and detail.item, the value of the item. It bubbles.
variants:
  mode:
    axis: appearance
    choose_when: "expanded on a wide screen; collapsed when the content needs the width; mobile on a narrow screen."
    do_not_combine_with:
      - "collapsed on a phone: use mobile."
  navigation:
    axis: appearance
    choose_when: "flyout, the default, for the sidebar of two levels or few destinations; panel-menu when the destinations reach the third level and the person needs the whole path in the column."
    do_not_combine_with:
      - "panel-menu with two levels or fewer than five destinations: use flyout."
      - "A group or a subgroup that is also a link: the click opens and closes."
  loading:
    axis: appearance
    choose_when: "While the list of the product is still arriving."
    do_not_combine_with: []
  corner-button:
    axis: appearance
    choose_when: "When the product has a main action: its label in corner-label. Off with hide-corner-button."
    do_not_combine_with:
      - "A page action, such as save or filter."
states:
  rest:
    token: sidebar/panel-background
    changes_for_user: "The panel floats on sidebar/panel-background, with a 1 px border in sidebar/panel-border and no shadow."
  loading:
    token: sidebar/item-height
    changes_for_user: "nph-skeleton rows in place of the items; the logo, the search and the corner button stay; the list is aria-busy."
  flyout-open:
    token: sidebar/flyout-background
    changes_for_user: "The flyout panel opens next to its opener, with the name of the opener as its title; its opener shows aria-expanded true."
  panel-menu-open:
    token: panel-menu/subgroup-foreground-open
    changes_for_user: "The subgroup shows its label in text/label-md and the arrow up, and its options grow in place below it, indented behind a group line; the group of the current page and its parent are born open."
  focus:
    token: focus/border
    changes_for_user: "Keyboard focus draws the 1 px focus/border border and the focus/halo halo outside the collapse button, the close button, the logo link and the flyout option; in the panel menu, the 1 px panel-menu/focus-border border and the panel-menu/focus-ring halo outside the subgroup."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "A disabled option or item at state/disabled-opacity, with no hover and no focus."
business_rules:
  - "The product chooses the mode, the current item and what opens; the menu only shows. The collapse button is the one exception: it switches expanded and collapsed and reports it."
  - "Only the navigation scrolls; the top and the foot stay fixed."
  - "Two levels in the list. The third level opens in a flyout panel next to its opener, or in place in the panel menu; there is no fourth level."
  - "A flyout panel opens on a click, Enter or Space, never on hover. Opening another panel of the same level closes the one open. Esc closes the innermost and gives the focus back to its opener."
  - "A click or the focus outside closes the flyout panel; opening it closes the balloon of its opener."
  - "The mobile menu is a modal dialog: the page is inert, the focus is trapped, Esc, the close button and the scrim close it."
  - "The panel menu is a navigation, not a new tag: the same items, and the child with options is drawn as a subgroup that opens its options in place, up to three levels."
  - "In the panel menu, a group and a subgroup are categories: they open and close and never go to a page. A category that needs a page holds a link."
  - "In the panel menu several groups stay open at once, and opening one closes none. The group of the current page and its parent are born open; a group the person closes stays closed, even when the product sends a new list."
  - "In the panel menu Esc does nothing and a click outside closes nothing: the open block grows in place and is not a layer. The collapsed menu and the mobile menu follow the rules of the sidebar."
  - "The menu does not write words of its own: every visible text and accessible name comes from the product."
domain_errors: []
tokens:
  panel: "sidebar/panel-background, sidebar/panel-border, sidebar/panel-radius (collapsed: sidebar/rail-radius)"
  width: "sidebar/panel-width expanded and mobile; layout/sidebar-collapsed collapsed"
  spacing: "sidebar/panel-spacing on the sides (collapsed: sidebar/rail-padding) and between top, middle and foot; space/section at top and bottom; sidebar/section-gap between the search, the separator and the navigation"
  search: "sidebar/search-background, sidebar/search-border"
  separator: "sidebar/separator"
  logo: "sidebar/logo-max-height; sidebar/logo-mark-size in the collapsed mode"
  group_label: "sidebar/group-label, text/heading-2xs, no uppercase"
  collapse_button: "control/height-default; icon/size-md place; focus/border"
  corner_button: "nph-button primary solid; nph-button icon-only plus when collapsed"
  panel_menu: "panel-menu/subgroup-height, panel-menu/subgroup-padding-x and -y, panel-menu/subgroup-gap, panel-menu/subgroup-radius, panel-menu/subgroup-icon-size, panel-menu/subgroup-foreground and -open, panel-menu/subgroup-background-hover, panel-menu/subgroup-disabled-opacity; panel-menu/focus-border, -border-width, -border-radius, panel-menu/focus-ring, -ring-width, panel-menu/focus-radius; panel-menu/nest-padding, panel-menu/nest-gap, panel-menu/guide-background, panel-menu/guide-width; panel-menu/item-gap, panel-menu/section-gap, panel-menu/label-gap; panel-menu/expand-duration and -easing; panel-menu/skeleton-row-height, -row-padding, -gap and -icon-size; text/body-md closed and text/label-md open"
  flyout: "sidebar/flyout-background, sidebar/flyout-border, sidebar/flyout-radius, elevation/dropdown, sidebar/flyout-title, sidebar/flyout-foreground, sidebar/flyout-option-hover"
  flyout_option: "control/height-default, sidebar/item-padding, sidebar/item-radius, sidebar/item-foreground-active, sidebar/item-foreground-open, state/disabled-opacity"
  mobile: "sidebar/mobile-offset, sidebar/scrim"
  focus: "focus/border, focus/halo, focus/ring-width, focus/border-radius-sidebar-item, focus/radius-sidebar-item"
  motion: "motion/expand-duration and motion/expand-easing for the width; motion/enter-* and motion/exit-* for the panels"
ai_hints:
  - "Use nph-sidebar for the main navigation of the product; for the tabs of a page, use nph-tabs."
  - "Give every entry its text, its icon and its href; mark only the current page as active."
  - "Switch to the mobile mode below the md breakpoint and open the menu with a button of your own."
  - "Pass the label of the landmark, the labels of the collapse and close buttons and every text in the language of the product."
  - "Use the corner button only for the main action of the product."
  - "Put a third level only in the options of a child: it opens in a flyout panel, or in place with navigation panel-menu."
  - "Use navigation panel-menu for a system with many destinations in up to three levels; with two levels or fewer than five destinations, keep the default."
  - "In the panel menu give every group and every child with options a value: the menu keeps the open state by it, so a list in another order keeps each choice, and nph-group-toggle says which one the person opened. Leave expanded out unless the product controls it."
accessibility:
  semantics: "A navigation landmark with a name; the items are links, and a group, a collapse button and an opener of a flyout panel are buttons with aria-expanded and aria-controls. In the panel menu a group and a subgroup are buttons with aria-expanded and aria-controls pointing to their block, which stays hidden while closed; there is no menu or tree role. The mobile menu is a modal dialog with the same name. The flyout panel is a group named by its title."
  accessible_name: "label names the landmark and the dialog. The collapse button carries collapse-label or expand-label, and the balloon is its name. In the collapsed mode, each rail button carries the item name in aria-label and in the balloon. The logo is a link named by logo-label. The current item carries aria-current page."
  keyboard:
    - "Tab and Shift+Tab: move through the logo link, the collapse button, the search, each item, subitem or rail button and the corner button, in reading order; the next Tab after an opener enters its flyout panel."
    - "Enter and Space: follow a link; open and close a group, a flyout panel or the options of a child. In the panel menu they open and close the group and the subgroup and keep the focus on the button; a closed block is out of the Tab order."
    - "Esc: closes the innermost flyout panel and gives the focus back to its opener; with none open, closes the mobile menu."
  focus: "focus/border and focus/halo on every focusable piece of the menu; panel-menu/focus-border and panel-menu/focus-ring on the subgroup. The corner button keeps the default focus of nph-button."
  contrast: "Every text of the menu passes 4.5:1 on its background, in light and dark, in the seven brands; the focus border passes 3:1 against the panel and against the flyout panel."
  color_alternative: "The active item uses the brand color, text/label-md and a solid icon; the active rail button turns its icon solid; the open flyout option uses the same color with the arrow, and the weight separates active from open."
invalid_combinations:
  - "A mode outside expanded, collapsed and mobile — the menu draws nothing."
  - "A navigation outside flyout and panel-menu — the menu draws nothing."
  - "A link without href, unless disabled — it leads nowhere."
  - "A group without children — it opens nothing."
  - "A child with options and an href, or with options and active — it opens a panel, it is not a page."
  - "A fourth level — the third level has no children."
relations:
  combines_with: [nph-sidebar-item, nph-sidebar-subitem, nph-sidebar-rail-button, nph-button, nph-input, nph-skeleton, nph-tooltip, nph-icon, nph-dropdown-menu]
  parents: []
  children: [nph-sidebar-item, nph-sidebar-subitem, nph-sidebar-rail-button, nph-button, nph-input, nph-separator, nph-skeleton, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Putting a page action in the corner button."
  - "Using the collapsed mode on a phone."
  - "Opening the flyout panel far from its opener."
  - "Marking two items as active."
  - "Putting the account of the person in the menu."
  - "Writing a line on every row: the one line is between the search and the navigation."
  - "Using the panel menu with two levels or fewer than five destinations."
  - "A group or a subgroup that is also a link: put the destination in a link inside it."
  - "Using the panel menu as a tree of data, of folders or files: use nph-tree."
sources:
  design_md: "design.md, the sidebar/* tokens, focus/border, overlay/scrim, color/primary-text and color/primary; docs/tokens.md"
  decision: "P116 — nph-sidebar: API and semantics; P124 — the panel menu navigation of nph-sidebar"
  tests: "src/components/nph-sidebar/nph-sidebar.test.ts and nph-sidebar.docs.test.ts"
  usage_evidence: "the required examples of the nph-sidebar Docs page"
  storybook: "src/components/nph-sidebar/nph-sidebar.stories.ts and nph-sidebar.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Sidebar 1367:2, documentation 4633:27036, sets 4605:9647, 4605:9612, 4605:9599, 4605:9589 and 4605:9594; panel menu documentation 5928:2591 (page 4128:29872), sets 5607:97 and 5608:168"
---

# nph-sidebar

## Function

**The problem it solves:** shows the main navigation of a product in a column on the left, so
the person knows where they are and changes area with one click. It has three modes —
expanded, collapsed and mobile — and two states, ready and loading. The list goes to the second
level, the item and the subitem; the third level opens in a flyout panel next to its opener, or,
in the panel menu navigation, in place, below its subgroup, with no side panel. In the collapsed
mode, an item with children opens a flyout panel next to its rail button, with the name of the
item as the title. The menu shows where the person is; the product decides the
current item and the mode. The account of the person is not in the menu: it is in the product
header.

**When to use:**

- For the main navigation of a product: one column on the left, with its areas and their pages.
- In the expanded mode, on a wide screen, when the names of the areas help the person to choose.
- In the collapsed mode, when the content needs the width: the rail shows the icons with a
  balloon, and an item with children opens a flyout panel next to it.
- In the mobile mode, on a narrow screen: the menu opens over the screen, with the scrim behind,
  and closes with the close button.
- With `loading`, while the list of the product is still arriving.
- With the corner button, for the main action of the product, such as All applications.
- With the panel menu navigation, for a system with many destinations in up to three levels, where the person needs to see the whole path without leaving the column.

**When NOT to use:**

- **For the tabs inside a page** — use `nph-tabs`.
- **For the actions of a button** — use `nph-dropdown-menu`.
- **For the top navigation** — use `nph-navigation-menu`.
- **For the page trail** — use `nph-breadcrumb`.
- **For the account of the person** — it belongs to the product header, not to the menu.
- **For a page action** in the corner button, such as save, filter or export — use `nph-button`
  in the page bar.
- **The collapsed mode on a phone** — use the mobile mode.
- **The panel menu with two levels or fewer than five destinations** — use the flyout navigation,
  which is the default.

## Variants

**By appearance:** the mode — `expanded`, `collapsed` or `mobile` — the navigation — `flyout` or
`panel-menu` — and the state, ready or `loading`; and two optional parts, the collapse button and
the corner button.

**By size:** `not_applicable`: the menu fills the height it receives, at `sidebar/panel-width`
or `layout/sidebar-collapsed`.

**By density:** `not_applicable`.

| Figma | Code | Choose when |
|---|---|---|
| `modo=expandido` | `mode="expanded"` | Wide screen, and the names of the areas help to choose |
| `modo=recolhido` | `mode="collapsed"` | The content needs the width: the rail shows the icons with a balloon |
| `modo=móvel` | `mode="mobile"` and `open` | Narrow screen, such as a phone |
| `estado=carregando` | `loading` | The list is still arriving |
| nav mode panel menu (frame `5928:2591`) | `navigation="panel-menu"` | The destinations reach the third level and the person needs the whole path in the column |
| `botão de recolher` | `hide-collapse-button` | The product does not let the person collapse the menu |
| `botão do canto` | `corner-label` and `hide-corner-button` | The product has a main action |

**Do not combine with:** the collapsed mode on a phone; a page action in the corner button; the
panel menu with two levels or fewer than five destinations; a group or a subgroup that is also a
link.

## States

| State | Token | What changes for the person |
|---|---|---|
| rest | `sidebar/panel-background` | The panel floats, with a 1 px border in `sidebar/panel-border` and no shadow |
| `loading` | `sidebar/item-height` | `nph-skeleton` rows in place of the items; the logo, the search and the corner button stay |
| flyout open | `sidebar/flyout-background` | The panel opens next to its opener, with its name as the title; the opener shows `aria-expanded` |
| panel menu open | `panel-menu/subgroup-foreground-open` | The subgroup shows `text/label-md` and the arrow up; its options grow in place below it, behind a group line |
| `focus` | `focus/border`, `focus/halo` | Border `border/width` and halo `focus/ring-width` outside the collapse button, the close button, the logo link and the flyout option; in the panel menu `panel-menu/focus-border` and `panel-menu/focus-ring` outside the subgroup |
| `disabled` | `state/disabled-opacity` | A disabled option or item fades, with no hover and no focus |

**Feedback and focus:** the corner button keeps the default focus of `nph-button`; the search
already uses `focus/border` in `nph-input`; the item, the subitem and the rail button use
`focus/border` too. A mouse click draws no ring.

**Business rule the piece carries:**

- The product chooses the mode, the current item and what opens; the menu only shows. The
  collapse button is the one exception: it switches expanded and collapsed and reports it with
  `nph-mode-change`.
- Only the navigation scrolls; the top and the foot stay fixed, so the focused line is never
  hidden behind them.
- Two levels in the list; the third level opens in a flyout panel, or in place in the panel menu.
  There is no fourth level.
- A flyout panel opens on a click, Enter or Space, never on hover, next to its opener, `space/inline`
  to the side with its top aligned, and stays inside the screen. One panel per level; Esc closes the
  innermost and gives the focus back to its opener; a click or the focus outside closes it.
- The mobile menu is a modal dialog: the page is inert, the focus is trapped, and Esc, the close
  button and the scrim close it, after `nph-close`.
- The panel menu is a navigation, not a new tag: the same `items`, and the child with `options`
  is drawn as a subgroup that opens its options in place, up to three levels. The collapsed
  menu is the rail with its flyout panels in both navigation modes; the mobile menu draws the panel
  menu inside the dialog.
- In the panel menu a group and a subgroup are categories: they open and close and never go to a
  page. A category that needs a page holds a link.
- In the panel menu several groups stay open at once, and opening one closes none. The group of
  the current page and its parent are born open, once. A group the person closes stays closed
  with no new mark, even when the product sends a new list; an `expanded` the product writes
  seeds a group, and a new value wins. `nph-group-toggle` tells the product.
- In the panel menu Esc does nothing and a click outside closes nothing: the open block grows in
  place and is not a layer.
- The menu writes no word of its own: every text and every accessible name comes from the product.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A navigation landmark with a name. A link is a link; a group, the collapse button and the opener of a flyout panel are buttons with `aria-expanded` and `aria-controls`; the flyout panel is a group named by its title. In the panel menu a group and a subgroup are buttons with `aria-expanded` and `aria-controls` pointing to their block, which is `hidden` while closed; there is no `menu` or `tree` role. The mobile menu is a modal dialog |
| Accessible name | `label` names the landmark and the dialog. The collapse button carries `collapse-label` or `expand-label`. Each rail button carries the name of the item in `aria-label` and in the balloon. The logo is a link named by `logo-label`. The current item carries `aria-current="page"`. A counter number is read inside the name of its link |
| Keyboard | Tab in reading order; the next Tab after an opener enters its panel. Enter and Space open and close a group or a panel. Esc closes the innermost panel and gives the focus back to its opener, and with none open it closes the mobile menu. In the panel menu Tab passes through the visible buttons and links, a closed block is out of the order, Enter and Space open and close the group and the subgroup and keep the focus on the button, and Esc does nothing |
| Focus | `focus/border` and `focus/halo` on every focusable piece of the menu, and `panel-menu/focus-border` and `panel-menu/focus-ring`, the same tokens, on the subgroup. It measures at least 3.38:1 in light and 4.81:1 in dark against the panel, and 4.32:1 and 4.91:1 against the flyout panel, in every brand |
| Contrast | Every text of the menu passes 4.5:1 on its background in light and dark, in the seven brands. In some brands, in dark, the background of the active rail button stays below 3:1 against the panel; the solid icon marks it |
| Alternative to color | The active item uses the brand color, `text/label-md` and a solid icon; the active rail button turns its icon solid; the open option uses the same color with the arrow, and the weight separates active from open. The open subgroup uses a heavier label and the arrow up; the group line is decoration, the indent and the order show the level |
| Touch target | Item and rail button at `sidebar/item-height` and `sidebar/rail-button-size`; subitem, subgroup, option, search, collapse button and corner button at `control/height-default`; all above 24 × 24 |
| Movement | In the panel menu the arrow of a group and of a subgroup turns 180 degrees and the block grows in place in `panel-menu/expand-duration` and `panel-menu/expand-easing`; with reduced motion nothing moves. The flyout panel and the mobile menu keep `motion/enter-*` and `motion/exit-*` |
| Known limits | The collapse button has a skeleton in place of the `sidebar` icon until it enters `nph-icon` (task DSA-72, D-1). Forced colors and right-to-left are not treated yet. A browser that does not interpolate `grid-template-rows` opens and closes the panel menu with no movement |

## Relations

**Combines with:** `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button`, by
instance; `nph-input`, the search; `nph-button`, the close button and the corner button;
`nph-skeleton`, the loading list; `nph-tooltip`, the balloon of the rail buttons and of the
collapse button; `nph-icon`.

**What is the parent:** none. The product places it in the application shell, in the column on the
left; in the mobile mode it floats over the screen.

**What is the child:** the pieces above, and the flyout panel, which is drawn by the menu itself.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Panel | `sidebar/panel-background`, `sidebar/panel-border`, `sidebar/panel-radius`; collapsed `sidebar/rail-radius` |
| Width | `sidebar/panel-width`; collapsed `layout/sidebar-collapsed` |
| Spacing | `sidebar/panel-spacing`, `sidebar/rail-padding`, `space/section`, `sidebar/section-gap` |
| Search | `sidebar/search-background`, `sidebar/search-border`, `sidebar/separator` |
| Logo | `sidebar/logo-max-height`, `sidebar/logo-mark-size` |
| Group label | `sidebar/group-label`, `text/heading-2xs` |
| Collapse button | `control/height-default`, `icon/size-md`, `focus/border` |
| Flyout panel | `sidebar/flyout-background`, `sidebar/flyout-border`, `sidebar/flyout-radius`, `elevation/dropdown`, `sidebar/flyout-title` |
| Panel menu subgroup | `panel-menu/subgroup-height`, `panel-menu/subgroup-padding-x`, `panel-menu/subgroup-padding-y`, `panel-menu/subgroup-gap`, `panel-menu/subgroup-radius`, `panel-menu/subgroup-icon-size`, `panel-menu/subgroup-foreground`, `panel-menu/subgroup-foreground-open`, `panel-menu/subgroup-background-hover`, `panel-menu/subgroup-disabled-opacity`; `text/body-md` closed, `text/label-md` open |
| Panel menu focus | `panel-menu/focus-border`, `panel-menu/focus-border-width`, `panel-menu/focus-border-radius`, `panel-menu/focus-ring`, `panel-menu/focus-ring-width`, `panel-menu/focus-radius` |
| Panel menu levels | `panel-menu/nest-padding`, `panel-menu/nest-gap`, `panel-menu/guide-background`, `panel-menu/guide-width`, `panel-menu/item-gap`, `panel-menu/section-gap`, `panel-menu/label-gap` |
| Panel menu motion and loading | `panel-menu/expand-duration`, `panel-menu/expand-easing`; `panel-menu/skeleton-row-height`, `panel-menu/skeleton-row-padding`, `panel-menu/skeleton-gap`, `panel-menu/skeleton-icon-size` |
| Flyout option | `sidebar/flyout-foreground`, `sidebar/flyout-option-hover`, `sidebar/item-foreground-active`, `sidebar/item-foreground-open`, `sidebar/item-padding`, `sidebar/item-radius` |
| Mobile | `sidebar/mobile-offset`, `sidebar/scrim` |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width`, `focus/border-radius-sidebar-item`, `focus/radius-sidebar-item` |
| Motion | `motion/expand-*`, `motion/enter-*`, `motion/exit-*` |

**Usage restrictions:** the menu has no shadow; the flyout panel has `elevation/dropdown`. The
width of the flyout panel has no token: it takes what its options need, at least a line of the
expanded menu and at most `layout/input-width`.

**AI hints:**

- Use `nph-sidebar` for the main navigation of the product; for the tabs of a page, use
  `nph-tabs`.
- Give every entry its text, its icon and its `href`; mark only the current page as `active`.
- Switch to the mobile mode below the `md` breakpoint and open the menu with a button of your
  own.
- Pass the `label` of the landmark, the labels of the collapse and close buttons and every text
  in the language of the product.
- Use the corner button only for the main action of the product.
- Put a third level only in the `options` of a child: it opens in a flyout panel, or in place with
  `navigation="panel-menu"`.
- Use `navigation="panel-menu"` for a system with many destinations in up to three levels; with two
  levels or fewer than five destinations, keep the default.
- In the panel menu give every group and every child with `options` a `value`: the menu keeps the
  open state by it, so a list in another order keeps each choice, and `nph-group-toggle` says which
  one the person opened. Leave `expanded` out unless the product controls it.

## Examples

**Recommended case:** a product with many areas, expanded, the current page `active`, a group
open with its subitems and the corner button at the foot.

**Alternative case:** the panel menu, `navigation="panel-menu"`, for a system with groups that
reach the third level: the group of the current page and its parent born open, the third level in
place, and several groups open; the list arriving, with `loading`; the phone, in the mobile mode over the
screen with the scrim; the collapsed menu with the flyout panel next to the rail button and the
third level next to the option.

## Anti-patterns

- **Do not put a page action in the corner button**, such as save, filter or export — use
  `nph-button` in the page bar.
- **Do not use the collapsed mode on a phone** — use the mobile mode.
- **Do not open the flyout panel far from its opener** — it opens next to it, top aligned, with its
  name as the title.
- **Do not mark two items as active** — only the current page is.
- **Do not put the account of the person in the menu** — it belongs to the product header.
- **Do not write a line on every row** — the one line is between the search and the navigation.
- **Do not use the panel menu with two levels or fewer than five destinations** — use the flyout
  navigation.
- **Do not make a group or a subgroup a link** — the click opens and closes; put the destination in
  a link inside it.
- **Do not use the panel menu as a tree of data, of folders or files** — use `nph-tree`.
- **Invalid combinations:** a `mode` outside the three; a link without `href`; a group without
  `children`; a child with `options` and an `href` or `active`; a fourth level.
- **Do not create without a decision:** a group collapsible by its label, a complementary area, an
  attached or inset surface, a keyboard shortcut to collapse, or a text of the menu written by it.

## Sources and decisions

- **The repository `design.md`:** the `sidebar/*` tokens, `focus/border`, `overlay/scrim`,
  `color/primary-text` and `color/primary`; the token table is in `docs/tokens.md`.
- **The decisions that originated it:** P116, the API and semantics of `nph-sidebar`, which amends
  P98 for the item, the subitem and the rail button; and P124, the panel menu navigation.
- **Pending decisions:** D-2 of the task DSA-72, with Indiane: the dark logo, provisional until
  the brand team says which version goes on a dark background. The `sidebar` icon in `nph-icon`
  (DSA-72 D-1) is answered and still to be drawn by the collapse button.
- **Tests:** `src/components/nph-sidebar/nph-sidebar.test.ts` and `nph-sidebar.docs.test.ts`.
- **Usage evidence:** the required examples of the `nph-sidebar` Docs page.
- **Storybook:** `src/components/nph-sidebar/nph-sidebar.stories.ts` and
  `nph-sidebar.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `NPH — Sidebar` (`1367:2`), documentation `4633:27036`,
  sets `4605:9647`, `4605:9612`, `4605:9599`, `4605:9589` and `4605:9594`; the panel menu,
  documentation `5928:2591` (page `4128:29872`), sets `5607:97` and `5608:168`.
