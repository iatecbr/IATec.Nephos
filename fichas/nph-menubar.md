---
piece: nph-menubar
level: component
status: active
solves: >-
  Gives an application its command menus in a horizontal bar, such as File, Edit and View: each top
  item opens a panel with the commands of its subject, by click or by keyboard, following the menubar
  pattern of the APG.
use_when:
  - "For an application with many commands that group into a few subjects, such as a document editor, a spreadsheet or a drawing tool, used with keyboard and mouse."
  - "In the header of the application, always in view, with each panel opening by click or by keyboard."
  - "A shortcut at the end of the item, to teach the keyboard to whoever uses the mouse."
  - "A choice of the item (single or multiple) for display options, such as a ruler, a grid or a density."
  - "narrow when the width of the page does not hold the bar: the application swaps the bar for the button with the bars icon."
do_not_use_when:
  - "To go to another page: use nph-navigation-menu or nph-sidebar."
  - "For the frequent actions that must stay in view: use nph-toolbar."
  - "For the few actions of one button: use nph-dropdown-menu."
  - "For the actions of the object under the pointer: use nph-context-menu."
  - "As a bar with a single top item: the bar groups subjects, and one subject is a button that opens a menu."
  - "With a submenu inside a submenu: one level only; what goes beyond goes to a dialog."
api:
  menus:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The top items, in order. A menu is { value, label, disabled, items }: value and
      label are required, label is the text of the top item, already localized and preferably one
      word, and items are the entries of its panel. The entries are an item (type absent or item), a
      label (type label, with text) that names the group after it, and a separator (type separator)
      that closes a group. The fields of an item are in the business rules. Two menus, or two items
      of a menu, with the same value leave the second one out. A list that is not a list, with no
      valid menu, or a menu with no valid item, draws nothing and emits console.error in
      development, one per cause.
  open-menu:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The value of the menu whose panel is open; empty is closed. The bar writes it when the person
      opens or closes a panel; the consumer may set it to show a panel open, and a panel opened from
      code takes no focus. A value that names no menu is reported in development and cleared; one
      that names a disabled menu is cleared. A menu that sits in the overflow item is not shown open
      by this property, since only the person opens the overflow item. It is ignored while narrow.
      Opening and closing fire no event.
  open-submenu:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The value of the item whose submenu is open; empty is closed. The bar writes it when the person
      opens or closes a submenu; the consumer may set it to show the submenu open. A value that names
      no enabled item with a submenu in the open panel is reported in development and cleared. A
      closed bar has no submenu open.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the bar, already localized, such as Editor menu: the menubar role asks
      for one. It wins over the aria-label of the host. A bar with neither draws and warns once in
      development, since the name may arrive after the first render.
  more-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the overflow top item, already localized, such as More. The bar measures itself and
      puts the top items that do not fit into that last item. Empty: nothing overflows into a menu,
      and the piece warns once in development.
  narrow:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The consumer swaps the bar for the button with the bars icon, which opens one panel with the
      menus as items with a submenu. The consumer chooses it, since the width is the page to know:
      the piece does not measure the breakpoint, by the rule of narrow of nph-navigation-menu. It
      needs menu-label, and without it the piece draws nothing and emits console.error in
      development. Reflects so the consumer can style and check the state.
  menu-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the narrow button, already localized, such as Menu. Required when
      narrow, because the icon has no text. Not read when the bar is wide.
variants:
  bar:
    axis: appearance
    choose_when: "Closed (the Figma `aberto` `não`) is the bar alone; open (`sim`) is the bar with the first top item open and its panel below. The piece draws both from open-menu."
    do_not_combine_with: []
  top_item:
    axis: appearance
    choose_when: "default at rest; hover and open share one look (the Figma `hover-aberto`); focus (`foco`) for keyboard users; disabled on a menu that does not apply now."
    do_not_combine_with:
      - "a disabled bar: there is no such property; a bar that does not apply on a screen leaves the screen."
  submenu:
    axis: structure
    choose_when: "closed by default. An item with a submenu draws the arrow and carries no shortcut. The submenu opens to the right of the panel, on the line of its item, at dropdown/submenu-offset, and to the left only when there is no room on the right."
    do_not_combine_with:
      - "a shortcut or a choice on the same item: the arrow takes the end of the item."
      - "a second level: a submenu has one level only."
  width:
    axis: appearance
    choose_when: "Wide when the bar fits the page, with the overflow item holding what does not fit; narrow on a narrow screen, chosen by the consumer."
    do_not_combine_with:
      - "narrow without menu-label"
  size:
    axis: density
    choose_when: "not_applicable. The top item is control/height-default high and the panel item 36; there is no compact size."
    do_not_combine_with: []
states:
  rest:
    token: "no background; label in menubar/trigger-foreground"
    changes_for_user: "The top item is quiet."
  hover_open:
    token: "background menubar/trigger-background-hover; label in menubar/trigger-foreground-hover"
    changes_for_user: "The top item takes the primary surface and its text. The pointer over it and its open panel share this look."
  focus:
    token: "border border/width in focus/border, radius focus/border-radius-control; halo focus/ring-width in focus/halo, radius focus/radius-control-with-border; no background"
    changes_for_user: "For keyboard users, a border and a halo outside the top item."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole top item loses opacity; no hover. It takes the focus but does not open."
  open_and_focus:
    token: "pending: the look is not drawn in Figma. The code composes the two accepted looks: the background and the label of hover_open plus the border and the halo of focus"
    changes_for_user: "While the arrows switch menus, the focus stays on the open top item, so it shows both looks (D-1, answered on 26/11/2026)."
business_rules:
  - "A menu has value, label, optionally disabled, and items. An item has value and text, both required, and optionally icon, severity, selection, checked, shortcut, submenu and disabled. An invalid entry is left out, with one console.error per cause in development."
  - "An item with a submenu takes no selection and no shortcut, and its submenu holds at least one valid item and no submenu of its own. A label entry opens a group and names it; a separator entry closes the group; a group with no item is dropped, and its separator goes to the next group."
  - "The bar has one Tab stop, on the top item used last (the first one, the first time): Tab enters and leaves the bar. With a panel open, Tab closes it and leaves. A click on a top item opens its panel; a click on the open one closes it. With a panel open, the pointer over another top item switches to it."
  - "The first panel opens below its top item, aligned with the start of the item, at menubar/panel-offset; it turns up when there is no room below, moves sideways past the side edge and shrinks and scrolls when it is short of height. The collision padding to the window edge is 4 px, a code setting with no token."
  - "The submenu opens to the right of the item, with its first item on the same line as the item that opened it, and to the left only when there is no room on the right. A gap of dropdown/submenu-offset (4 px) separates the panel from the submenu, on the side that faces the panel; the code reads the token from the computed style. In right-to-left writing everything mirrors, and Left and Right swap."
  - "When the person activates an item, the bar fires nph-item-select, which bubbles, with detail value, checked and menu: checked is the new state of a single or multiple choice and null on a common item; menu is the value of the top item the command belongs to, also from the overflow panel and from the narrow button. A single choice already checked fires again with checked true. Changing menus, open-menu or open-submenu from code fires nothing."
  - "After an activation, the bar replaces menus with a new list that carries the new checked, also inside a submenu; the objects of the consumer are never changed. Single choice is exclusive inside its group."
  - "Enter on an item activates it and closes the whole menu, also on a checkbox and a radio. Space on a checkbox or a radio checks it without closing; on a common item, it does the same as Enter. A click on a common item or a single choice closes the menu; on a multiple choice it keeps it open. An item with a submenu opens its submenu when activated. Focus goes back to the top item when the menu closes by an item or Esc."
  - "Esc closes one level at a time: the first closes the submenu and focuses the item that opened it, the second closes the panel and focuses the top item. With the panel closed, on the top item, Esc does nothing. A press outside closes the panels and leaves the focus where the person pressed; a press on another top item switches menus."
  - "A disabled top item or panel item takes the focus and does not run (aria-disabled). Hide an action the person can never perform (permission); disable one that is unavailable now."
  - "Overflow: the bar measures its own width. The top items that do not fit go into a last top item, with more-label as its text, which opens a panel with them as items with a submenu, in one level. The bar does not wrap into a second line. A menu that already has a submenu shows those items under a group label, so the panel stays in one level. Without more-label nothing overflows."
  - "narrow: the consumer swaps the bar for a button with the bars icon, named by menu-label, which opens the same panel as the overflow item, with every menu as an item with a submenu in one level. The piece does not measure the breakpoint. Mobile is out of this piece."
  - "The panel is not an instance of nph-dropdown-menu in code: it is drawn by the bar, with the same dropdown/* tokens, so it looks the same (D-4)."
  - "The panel enters and leaves with motion/enter-* and motion/exit-*, sliding space/inline-tight. Under reduced motion, opacity only, on motion/hover-duration. A submenu opens and closes by pointer after motion/hover-delay."
domain_errors: []
tokens:
  bar: menubar/bar-gap
  top_item: [menubar/trigger-height, menubar/trigger-padding-x, menubar/trigger-radius, menubar/trigger-foreground, text/label-md]
  top_item_hover_open: [menubar/trigger-background-hover, menubar/trigger-foreground-hover]
  top_item_focus: [border/width, focus/border, focus/border-radius-control, focus/ring-width, focus/halo, focus/radius-control-with-border]
  panel_offset: menubar/panel-offset
  submenu_gap: dropdown/submenu-offset
  panel: [color/popover, color/popover-foreground, layout/input-width, dropdown/panel-radius, elevation/dropdown]
  panel_border: [border/width, color/dropdown-border]
  panel_padding: space/inline-tight
  group_label: [text/label-sm, color/muted-foreground, space/inline, space/inline-tight]
  separator: [dropdown/separator, space/inline-tight]
  item: [space/inline, dropdown/item-radius, text/body-md, color/popover-foreground]
  icon: icon/size-md
  shortcut: [text/caption, color/muted-foreground]
  arrow: icon/size-sm
  single_choice: [text/label-md, color/primary-text]
  destructive: [dropdown/item-destructive-foreground, dropdown/item-destructive-hover-foreground, dropdown/item-destructive-hover-background]
  item_hover: [color/primary-surface, dropdown/item-destructive-hover-background, dropdown/item-hover-icon-foreground]
  item_focus: [border/width, focus/border, dropdown/item-focus-border-radius, focus/ring-width, focus/halo, dropdown/item-focus-halo-radius]
  disabled: state/disabled-opacity
  motion: [motion/enter-duration, motion/enter-easing, motion/exit-duration, motion/exit-easing, motion/hover-delay]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-menubar for the commands of a whole application, grouped by subject; for frequent actions in view, use nph-toolbar; for the few actions of one button, use nph-dropdown-menu; for the actions of an object, use nph-context-menu; to go to another page, use nph-navigation-menu or nph-sidebar."
  - "Give the bar its name with label, and fill menus with data: each menu has a value, a label and items, with labels and separators between the groups."
  - "Listen to nph-item-select on the bar and read detail.value, detail.checked and detail.menu."
  - "Show the shortcut at the end of the item, and use a single or multiple choice for display options, because the mark shows the state besides the color."
  - "Leave a command that does not apply now disabled, not hidden, and put the destructive item last, after a separator, with an icon and a label that say the action."
  - "Give more-label so the top items that do not fit go into the last item, and choose narrow, with menu-label, when the page is narrow: the piece does not measure the breakpoint."
  - "Do not nest a second submenu, and do not put a shortcut or a choice on an item with a submenu."
accessibility:
  semantics: "The bar is role=menubar, named by label. Each top item is a native button with role=menuitem, aria-haspopup=menu and aria-expanded. The panel is a popover in the top layer with role=menu named by its top item; every group is a role=group, named by its label when it has one, because the separator is hidden from the accessibility tree. A common item is menuitem; a single choice is menuitemradio; a multiple choice is menuitemcheckbox; aria-checked follows checked. An item with a submenu carries aria-haspopup=menu, aria-expanded and aria-controls, and the submenu is a menu named by that item. The inner nph-checkbox is inert: the item carries the role, the state and the focus. The overflow item is a menuitem with aria-haspopup inside the bar."
  accessible_name: "The bar: label, else the aria-label of the host. A top item: its label. An item: its text, through aria-labelledby. The shortcut goes in aria-keyshortcuts, written in the syntax of the attribute (Ctrl becomes Control, the Command symbol becomes Meta). The narrow button: menu-label. Icons, box, arrow and check are not read."
  keyboard:
    - "Tab and Shift+Tab: one stop in the bar, on the top item used last; with a panel open, they close it and leave the bar."
    - "On the bar, with the menu closed: Left and Right move between the top items with wrap, and Home and End go to the first and the last (the two arrows swap in right-to-left)."
    - "Enter, Space and Down on a top item open its panel on the first item; Up opens it on the last item."
    - "With a panel open, Left and Right close it, move to the neighbor top item and open its panel, keeping the focus on that top item."
    - "In the panel: Down and Up move with wrap; Home and End go to the ends; a typed character goes to the next item that starts with it."
    - "Right opens the submenu of an item that has one and focuses its first item; on an item with none, it goes to the next menu. Left closes the submenu and gives the focus back to its item; at the first level it goes to the previous menu."
    - "Enter activates the item and closes the menu, also on a checkbox and a radio; Space checks a checkbox or a radio without closing, and on a common item does the same as Enter."
    - "Esc closes one level at a time: the submenu, then the panel, giving the focus back to the item that opened it; on the top item with the menu closed, it does nothing."
  focus: "On the top item: keyboard only, a border of border/width in focus/border and a halo in focus/halo outside the item; the border carries the focus, the halo is decorative. In the panel the item takes the same border in focus/border, and the halo. Opened by keyboard, the first item takes the focus and shows it; opened by a click, it takes the focus without showing it. The pointer over a panel item takes the focus to it. When the menu closes, the focus goes back to the top item."
  contrast: "The top item label passes 4.5:1 in both themes: menubar/trigger-foreground on color/background at rest and, in hover or open, menubar/trigger-foreground-hover on menubar/trigger-background-hover, with the lowest at 6.43:1 across the seven brands and the two themes. The focus/border border of the top item passes 3:1 on color/background in every brand, the lowest 4.32:1 (light, Comercial); the halo is decoration. The focus/border border of the panel item passes 3:1 on color/popover in every brand and both themes (Gerencial, dark: 5.53:1). The text of the panel comes from the dropdown item; its lowest is 5.2:1 (checked radio, Financeiro, dark). A disabled item is outside the rule."
  color_alternative: "The open top item has the open panel below it, besides the background. The item with a submenu has the arrow, and open it keeps the hover background. A checked checkbox shows the check in the box and a checked radio shows the check at the end of the item. The destructive item says the action in its label and carries the trash icon, besides the color."
invalid_combinations:
  - "menus that is not a list, or with no valid menu — there is nothing to open; the bar draws nothing."
  - "a menu without value, label or a valid item — it has no name, no text or an empty panel; the menu is left out."
  - "two menus, or two items of a menu, with the same value — the event could not tell them apart; the second one is left out."
  - "an item without value or text — it has no name or nothing to report; the item is left out."
  - "submenu with a selection other than none — a submenu item is not a choice; the item is left out."
  - "submenu with a shortcut — the arrow takes the end of the item; the item is left out."
  - "an item inside a submenu that has a submenu — one level only; the item is left out."
  - "narrow without menu-label — the button has an icon and no text; the bar draws nothing."
relations:
  combines_with: [nph-icon, nph-checkbox, nph-separator, nph-button]
  parents: ["the header of an application"]
  children: [nph-icon, nph-checkbox, nph-separator, nph-button]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the bar to go to another page: use nph-navigation-menu or nph-sidebar."
  - "Using the bar for the actions of one object or one button: use nph-context-menu or nph-dropdown-menu."
  - "Making a bar with a single top item."
  - "Nesting a second level of submenu."
  - "Putting the destructive item among the other actions."
  - "Hiding a command that does not apply now, instead of disabling it."
  - "Making the bar the only path to a command that people need in view: the toolbar keeps it in view."
sources:
  design_md: "design.md, menubar/*, dropdown/submenu-offset, color/foreground, color/primary-surface-hover, color/primary-on-surface-hover, color/popover, color/popover-foreground, color/dropdown-border, color/border-subtle, color/primary-surface, color/primary-text, color/muted-foreground, color/destructive-text, dropdown/*, layout/input-width, elevation/dropdown, space/inline, space/inline-tight, space/control-padding, control/height-default, radius/control, icon/size-md, icon/size-sm, text/body-md, text/caption, text/label-sm, text/label-md, focus/border, focus/ring-width, focus/halo, focus/border-radius-control, focus/radius-control-with-border, state/disabled-opacity and motion/*"
  decision: "P126 — nph-menubar: API and semantics; the focus border and the submenu gap of the dropdown item (amends P92 and P113)"
  tests: "src/components/nph-menubar/nph-menubar.test.ts and nph-menubar.docs.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-menubar/nph-menubar.stories.ts and nph-menubar.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page 1626:15, documentation frame 6432:8686, root 6410:7413, sets nph-menubar 6410:7769 and nph-menubar top item 6402:4299"
---

# nph-menubar

## Function

**The problem it solves:** gives an application its command menus in a horizontal bar, such as File,
Edit and View. Each top item opens a panel with the commands of that subject, by click or by keyboard,
and the bar stays in view in the header. It follows the menubar pattern of the APG: one Tab stop, the
arrows between top items, and a panel that opens on the first item.

**When to use:**

- For an application with many commands that group into a few subjects, such as a document editor, a
  spreadsheet or a drawing tool, used with keyboard and mouse.
- In the header of the application, always in view, with each panel opening by click or by keyboard.
- A shortcut at the end of the item, to teach the keyboard to whoever uses the mouse.
- A choice of the item, single or multiple, for display options, such as a ruler, a grid or a density.
- `narrow` when the width of the page does not hold the bar: the application swaps the bar for the
  button with the `bars` icon.

**When NOT to use:**

- **To go to another page** — use `nph-navigation-menu` or `nph-sidebar`.
- **For the frequent actions that must stay in view** — use `nph-toolbar`.
- **For the few actions of one button** — use `nph-dropdown-menu`.
- **For the actions of the object under the pointer** — use `nph-context-menu`.
- **As a bar with a single top item** — the bar groups subjects.
- **With a submenu inside a submenu** — one level only; what goes beyond goes to a dialog.

## Variants

**By appearance:** the state of the bar, `aberto` in Figma, and the state of the top item.

| Variant | Choose when |
|---|---|
| Bar `aberto` `não` | The bar alone, with no panel open |
| Bar `aberto` `sim` | The bar with the first top item open and its panel below; the piece draws it from `open-menu` |
| Top item `default` | At rest |
| Top item `hover-aberto` | Pointer over it, or its menu open: one look for the two |
| Top item `foco` | A keyboard user is on it |
| Top item `disabled` | A menu that does not apply now |

The type of the item and its choice come from the item of the panel, as in `nph-dropdown-menu` and
`nph-context-menu`: `severity` `default` or `destructive` (the destructive item last, after a
separator), and `selection` `none`, `single` (the checked one shows the check at the end) or `multiple`
(the box comes at the start).

**By size:** not applicable to the piece; there is no size axis.

**By density:** `not_applicable`. The top item is `control/height-default` high and the panel item is 36
high; a multiple choice row is 40, the touch area of the box. There is no compact size.

**By structure:** an item with a submenu draws the arrow and carries no shortcut. The submenu has one
level, opens to the right and opens to the left only when there is no room. The width is wide or
`narrow`: the overflow item holds what does not fit, and the consumer swaps the bar for the button on a
narrow screen.

**The properties of the bar:**

| Property | Rule |
|---|---|
| `menus` | Required. The top items, in order |
| `open-menu` | The `value` of the menu whose panel is open; the Figma `aberto` |
| `open-submenu` | The `value` of the item whose submenu is open |
| `label` | The accessible name of the bar, already localized |
| `more-label` | The text of the overflow item; without it nothing overflows |
| `narrow` | The consumer swaps the bar for the button with the `bars` icon |
| `menu-label` | The accessible name of that button; required when `narrow` |

**The menu entry:** `value` (required, what `open-menu` and `nph-item-select` report), `label` (required,
the text of the top item), `disabled` and `items`, the entries of its panel.

**The item entry:**

| Field | Rule |
|---|---|
| `value` | Required. What `nph-item-select` reports |
| `text` | Required. The label, on one line, cut with an ellipsis; the accessible name |
| `icon` | A core name of `nph-icon`, light at `icon/size-md`; solid on highlight (hover, focus and open submenu) |
| `severity` | `default` or `destructive` |
| `selection` | `none`, `single` or `multiple` |
| `checked` | The state of a choice |
| `shortcut` | Plain text at the end, in `text/caption`, written in `aria-keyshortcuts`. Not on an item with a submenu |
| `submenu` | A list of entries, one level: the arrow at the end |
| `disabled` | The state that does not activate |

A description, an avatar, a tag, a counter, a switch, a loading state and a header on an item are not in
the contract, so they are not in the entry.

**Choose this variant when:** the tables above say it.

**Do not combine with:** `narrow` without `menu-label`; a submenu with a selection or a shortcut; a
submenu inside a submenu.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Top item | Rest | `menubar/trigger-foreground`, no background | The label, with no background |
| Top item | Hover, open | `menubar/trigger-background-hover`, `menubar/trigger-foreground-hover` | The primary surface and its text; the open top item keeps this look, with its panel below |
| Top item | Focus | border `border/width` in `focus/border`, radius `focus/border-radius-control`; halo `focus/ring-width` in `focus/halo`, radius `focus/radius-control-with-border`; no background | For keyboard users, a border and a halo outside the item |
| Top item | Disabled | `state/disabled-opacity` | The whole item loses opacity; no hover; it takes the focus and does not open |
| Top item | Open and focus | decided (D-1) | The code composes the two looks |
| Panel item | Rest | no background; text in `color/popover-foreground` | The row is quiet; the start icon is light |
| Panel item | Hover | `color/primary-surface`; icon in `dropdown/item-hover-icon-foreground`. Destructive: `dropdown/item-destructive-hover-background`, with the label, shortcut and icon in `dropdown/item-destructive-hover-foreground` | The row takes the surface; the start icon and the submenu arrow turn solid; the label keeps its color. The item whose submenu is open keeps this look |
| Panel item | Focus | border `border/width` in `focus/border`, radius `dropdown/item-focus-border-radius`; halo `focus/ring-width` in `focus/halo`, radius `dropdown/item-focus-halo-radius` | For keyboard users, a border and a halo outside the row; the start icon turns solid |
| Panel item | Disabled | `state/disabled-opacity` | The whole row loses opacity; it takes the focus but does not activate; its icon stays light |

The open top item and the panel item in hover are told apart: the bar is one step above, on
`color/primary-surface-hover`, and the panel item stays on `color/primary-surface`. A bar trigger open
or in hover uses the primary palette, not gray, and only a bar does: the trigger of `nph-dropdown-menu`
and the ellipsis of `nph-breadcrumb` stay gray.

A checked and disabled checkbox or radio in the panel keeps the mark under `state/disabled-opacity`. The
top item has neither selected nor error, so that combination does not apply to it.

**Feedback and focus:** focus appears only for keyboard users and **is not removed**. The top item and
the panel item show the same two layers outside the box, a border and a halo, without changing its size.
The start icon is light at rest and when disabled, and solid on highlight.

**The open top item in focus.** While the arrows switch menus, the focus stays on the top item, so the
item is open and focused at once. The Figma draws `hover-aberto` and `foco` apart and does not draw the
two together. As Indiane decided on 26/11/2026 (D-1), the code composes the two accepted looks: the
background and the label of the open item, with the border and the halo of the focus. It adds no third
look.

**Business rule the piece carries:**

- The bar has one Tab stop, on the top item used last. A click on a top item opens its panel; a click on
  the open one closes it. With a panel open, the pointer over another top item switches to it, and the
  focus goes to that top item. With no panel open, a panel opens only by click or key.
- The first panel opens below its top item, aligned with its start, at `menubar/panel-offset`. The submenu
  opens beside it, on the line of its item, at `dropdown/submenu-offset`. Both are read from the computed
  style, as the margin of the side that faces the item.
- When the person activates an item, the bar fires `nph-item-select`, which bubbles, with `detail.value`,
  `detail.checked` (`null` on a common item) and `detail.menu`, the `value` of the top item. Changing
  `menus`, `open-menu` or `open-submenu` from code fires nothing.
- After an activation, the bar replaces `menus` with a new list that carries the new `checked`; the
  objects of the consumer are never changed. Single choice is exclusive inside its group.
- Enter closes the menu, also on a choice; Space checks a choice without closing; a click on a choice
  closes the menu for a single choice and keeps it open for a multiple choice (D-2).
- Esc closes one level at a time. A press outside, Tab and the focus leaving close the panels.
- **Overflow.** The bar measures itself: a hidden probe row, not read by assistive technology, gives the
  width of every top item, and what does not fit goes into the last top item, `more-label`, which opens a
  panel with those menus as items with a submenu. The bar does not wrap into a second line, because two
  lines change the reading order and the arrow navigation.
- **Narrow screen.** `narrow` is the consumer's choice. The bar gives way to a button with the `bars` icon
  (the `nph-button` without visible text), named by `menu-label`, which opens the same panel as the
  overflow item with every menu as an item with a submenu. Mobile is out of this piece.
- **One level.** The overflow panel and the narrow panel keep one level of submenus: a menu that already
  has a submenu shows those items under a group label, in the submenu of its menu.
- **Placement.** The panel turns up when there is no room below, moves sideways past the side edge and
  shrinks and scrolls when it is short of height. It keeps 4 px from the window edge: the collision
  padding is a code setting (`COLLISION_PADDING`), with no token and no Figma part.
- The panel enters and leaves on `motion/enter-*` and `motion/exit-*`, sliding `space/inline-tight`; under
  reduced motion, opacity only, on `motion/hover-duration`. A submenu opens and closes by pointer after
  `motion/hover-delay`.

**Domain error states:** an invalid `menus` or a `narrow` bar without `menu-label` draws nothing; a menu or
an item that breaks its rule is left out; an `open-menu` or `open-submenu` that names nothing is cleared.
Each emits `console.error` in development, one per cause. A bar with no accessible name draws and warns
once in development, and so does a bar wider than its room with no `more-label`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The bar is a `role=menubar`, named. Each top item is a native `button` with `role=menuitem`, `aria-haspopup` and `aria-expanded`. The panel is a popover in the top layer with a `role=menu` named by its top item; every group is a `role=group`, named by its label when it has one. Items are `menuitem`, `menuitemradio` (single choice) or `menuitemcheckbox` (multiple choice), with `aria-checked`. An item with a submenu carries `aria-haspopup`, `aria-expanded` and `aria-controls`, and its submenu is a menu named by it. The inner `nph-checkbox` is `inert`. The overflow item is a `menuitem` with `aria-haspopup` inside the bar, so the arrows keep working |
| Accessible name | The bar: `label`, else the `aria-label` of the host. A top item: its `label`. An item: its `text`. The shortcut goes in `aria-keyshortcuts`. The narrow button: `menu-label`. Support icons, the box, the arrow and the check are not read |
| Keyboard | The menubar pattern of the APG, where the Radix default differs: Tab enters the bar on the top item used last and leaves it. ← → and Home End on the bar, with wrap. Enter, Space and ↓ open the panel on the first item, ↑ on the last. With a panel open, ← → switch menus and the focus stays on the top item. In the panel ↑ ↓ with wrap, Home, End and a typed character; → opens the submenu, or goes to the next menu; ← closes the submenu, or goes to the previous menu. Enter closes, also on a choice; Space checks a choice without closing. Esc closes one level at a time. A disabled item takes the focus and does not run |
| Focus | The `focus/border` border carries the focus on the top item and on the panel item; the halo is decorative. Opened by keyboard, the first item takes the focus and shows it; opened by a click, it takes the focus without showing it. The pointer over a panel item takes the focus to it. On close by Esc or by an item, the focus returns to the top item. A press outside closes and leaves the focus where the person pressed |
| Contrast | The top item label passes 4.5:1 in both themes; in hover and open the lowest is 6.43:1. The `focus/border` border of the top item passes 3:1 on `color/background` in every brand, the lowest 4.32:1 (light, Comercial); the one of the panel item passes 3:1 on `color/popover` (Gerencial, dark: 5.53:1). The halo is decoration. The text of the panel comes from the dropdown item, the lowest 5.2:1 (checked radio, Financeiro, dark). A disabled item is outside the rule |
| Alternative to color | The open top item has its panel below it; the item with a submenu has the arrow; a checkbox shows the check in the box and a radio shows the check at the end; the destructive item carries the trash icon and says the action in its label |
| Touch target | The top item and the panel item are 36 high in the default size, above 24 by 24; the panel takes the width of `layout/input-width` |
| Known limits | (a) The panel is drawn by the bar, with the `dropdown/*` tokens, and is not an instance of `nph-dropdown-menu` in code (D-4). (b) A click on a top item opens the panel with the first item focused but not shown, where the evidence says no item highlighted (D-3). (c) The open top item in focus has no drawn look (D-1). (d) A forced-colors mode is not handled, and neither is a second submenu level, a compact size, a vertical bar or a mobile layout. (e) A menu that sits in the overflow item cannot be shown open by `open-menu`; only the person opens the overflow item, and `open-menu` is ignored while `narrow`. (f) The bar has no background of its own: the header supplies it, and focus and text are measured against `color/background` |

## Relations

**Combines with:** `nph-icon` (the start icon, the arrow and the check), `nph-checkbox` (multiple choice),
`nph-separator` and `nph-button` (the narrow button, without text); the item, the group label and the
separator take the look of `nph-dropdown-menu` through its `dropdown/*` tokens, and the open submenu the
look of `nph-context-menu`.

**Choose by case:**

| Case | Piece |
|---|---|
| The commands of a whole application, grouped by subject | `nph-menubar` |
| The frequent actions, in view | `nph-toolbar` |
| The few actions of one button | `nph-dropdown-menu` |
| The actions of the object under the pointer | `nph-context-menu` |
| Going to another page | `nph-navigation-menu` or `nph-sidebar` |

`nph-navigation-menu` is the sibling bar of triggers that open a panel, and it is disclosure navigation, not
a menubar: Tab and Enter, no arrow keys, links in its panel. The menubar uses the same top item idea with a
panel of commands and the APG menubar pattern; it does not mark the current page.

**What is the parent:** the header of the application, on `color/background`. The bar has no background of
its own.

**What is the child:** `nph-icon`, `nph-checkbox`, `nph-separator` and `nph-button`, drawn by the bar. The
item is not a tag of its own.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Bar | `menubar/bar-gap` between top items; no background and no border of its own |
| Top item | `menubar/trigger-height`, `menubar/trigger-padding-x` on each side (the width hugs the label), `menubar/trigger-radius`, label in `menubar/trigger-foreground`, `text/label-md` |
| Top item, hover and open | `menubar/trigger-background-hover`, `menubar/trigger-foreground-hover` |
| Top item, focus | `border/width` in `focus/border`, radius `focus/border-radius-control`; `focus/ring-width` in `focus/halo`, radius `focus/radius-control-with-border` |
| Top item, disabled | `state/disabled-opacity` on the whole item |
| Panel offset | `menubar/panel-offset` between the top item and the first panel, as the margin of the side that faces it |
| Submenu gap | `dropdown/submenu-offset` between the panel and the open submenu, on the side that faces the panel; read by the code from the computed style |
| Panel | `color/popover`, `layout/input-width`, `dropdown/panel-radius`, `elevation/dropdown`, padding `space/inline-tight` |
| Panel border | `border/width` in `color/dropdown-border`, which resolves to `color/border-subtle` |
| Group label | `text/label-sm` in `color/muted-foreground`, `space/inline` on the sides, `space/inline-tight` above and below |
| Separator | `nph-separator` in `dropdown/separator`, `space/inline-tight` above and below |
| Item | `space/inline` padding and gap, `dropdown/item-radius`, `text/body-md` in `color/popover-foreground` |
| Shortcut | `text/caption` in `color/muted-foreground` |
| Single choice | `text/label-md` in `color/primary-text`; check solid at `icon/size-sm` |
| Destructive | `dropdown/item-destructive-foreground`; hover `dropdown/item-destructive-hover-foreground` on `dropdown/item-destructive-hover-background` |
| Item hover | `color/primary-surface`, `dropdown/item-destructive-hover-background`, `dropdown/item-hover-icon-foreground` |
| Item focus | `border/width`, `focus/border`, `dropdown/item-focus-border-radius`, `focus/ring-width`, `focus/halo`, `dropdown/item-focus-halo-radius` |
| Item disabled | `state/disabled-opacity` |
| Icons | `icon/size-md` at the start, `icon/size-sm` for the arrow and the check |
| Motion | `motion/enter-*` and `motion/exit-*`; `motion/hover-delay` for the submenu; `motion/hover-duration` under reduced motion |
| Narrow button | The tokens of `nph-button` |
| Window edge | 4 px; a code setting (`COLLISION_PADDING`), with no token |

**Usage restrictions:** the bar has no token for the focus, the disabled opacity or the text style of the
top item: it uses the system values directly, as the approved siblings do, and has a token of its own only
if it ever needs a different value. It does not choose width, height, color, radius or typography:
everything comes from a token. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-menubar` for the commands of a whole application, grouped by subject; for frequent actions in
  view, use `nph-toolbar`; for the few actions of one button, use `nph-dropdown-menu`; for the actions of an
  object, use `nph-context-menu`; to go to another page, use `nph-navigation-menu` or `nph-sidebar`.
- Give the bar its name with `label`, and fill `menus` with data: each menu has a `value`, a `label` and
  `items`, with labels and separators between the groups.
- Listen to `nph-item-select` on the bar and read `detail.value`, `detail.checked` and `detail.menu`.
- Show the shortcut at the end of the item, and use a single or multiple choice for display options,
  because the mark shows the state besides the color.
- Leave a command that does not apply now disabled, not hidden, and put the destructive item last, after a
  separator, with an icon and a label that say the action.
- Give `more-label` so the top items that do not fit go into the last item, and choose `narrow`, with
  `menu-label`, when the page is narrow: the piece does not measure the breakpoint.
- Do not nest a second submenu, and do not put a shortcut or a choice on an item with a submenu.

## Examples

**Recommended case:** the editor with the File menu open: New and Open with their shortcuts, Recent with
a submenu of files opened a short while ago, a separator and the destructive Delete last, in a bar with
Edit, View and Help. The View menu with a group label, Ruler and Grid as checkboxes, and Comfortable and
Compact as radios; a checked and disabled option keeps its mark under the disabled opacity.

**Alternative case:** the same bar with a long label, such as Advanced settings, whose item hugs the
label; the bar on a narrower header, with the last menus inside More; or the narrow screen, with the button
that has the `bars` icon opening one panel with the menus as submenus.

## Anti-patterns

- **Do not use the bar to go to another page** — use `nph-navigation-menu` or `nph-sidebar`.
- **Do not use it for the actions of one object or one button** — use `nph-context-menu` or
  `nph-dropdown-menu`.
- **Do not make a bar with a single top item** — a subject alone is a button that opens a menu.
- **Do not nest a second submenu** — one level only; what goes beyond goes to a dialog.
- **Do not put the destructive item among the other actions** — leave it last, after a separator.
- **Do not hide a command that does not apply now** — leave it disabled, so the person learns where it is.
- **Do not ask the bar to measure the breakpoint for the narrow screen** — the consumer chooses `narrow`.
- **Invalid combinations:** a `narrow` bar without `menu-label`; a submenu with a selection or a shortcut; a
  submenu inside a submenu; an item without `value` or `text`; two menus or two items of a menu with the
  same `value`.
- **Do not create or adapt without a decision:** a second submenu level, a compact size, a vertical bar, a
  mobile layout and any token.

## Sources and decisions

- **The repository `design.md`:** the tokens of the table above, with `menubar/*` and `dropdown/submenu-offset`,
  taken with this piece.
- **The decision that originated it:** P126, which also moves the focus border of the `nph-dropdown-menu`
  item to `focus/border` (it reaches `nph-context-menu`) and gives the submenu of `nph-context-menu` the gap
  `dropdown/submenu-offset`. The documentation was accepted by the design owner in Figma.
- **Tests:** `src/components/nph-menubar/nph-menubar.test.ts` and `nph-menubar.docs.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-menubar/nph-menubar.stories.ts` and `nph-menubar.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `1626:15`, documentation frame `6432:8686`, root `6410:7413`.
- **Decisions of the design owner (P126), all answered (D-2 to D-4 on 23/11/2026, D-1 on 26/11/2026):**
  - **D-1 — the open top item in focus.** The arrows switch menus and the focus stays on the top item, so it
    is open and focused at once; the Figma draws the two states apart. The code composes the open look with
    the focus border and halo, and adds no third look. Confirmed.
  - **D-2 — Enter, Space and the click on a choice.** Enter closes the menu, also on a checkbox and a radio,
    and Space checks without closing; a click on a multiple choice keeps the menu open. The Figma covers the
    two keys, not the click.
  - **D-3 — the click opens with no item shown.** The evidence says the panel opens by click with no item
    highlighted; the code gives the first item the focus without showing it, as `nph-dropdown-menu` and
    `nph-context-menu` do.
  - **D-4 — the panel is not an instance in code.** The Figma panel is an instance of `nph-dropdown-menu`;
    the code draws the panel in the bar, with the same `dropdown/*` tokens, as `nph-context-menu` does
    (P113). The look is the same; a change in the dropdown item reaches the bar only by the tokens.
