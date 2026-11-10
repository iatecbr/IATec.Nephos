---
piece: nph-context-menu
level: component
status: active
solves: >-
  Shows the actions of the object under the pointer in a menu that opens at the point of the
  right click, as a shortcut to actions the person is already looking at. It never replaces the
  visible path to the same actions.
use_when:
  - "For frequent actions on an object the person is already looking at, such as a file, a table row or a card."
  - "For few actions in short groups, with the destructive item last, after a separator."
  - "The default size on most screens; the compact size on dense screens, such as tables."
  - "A submenu of one level only, for actions that unfold, such as Share."
do_not_use_when:
  - "As the only path to an action: every action of the menu also exists on the screen, for whoever does not use the right button."
  - "For many actions: use a screen or a dialog."
  - "For actions that open from a visible button: use nph-dropdown-menu."
  - "For actions that must stay always in view: use a toolbar."
api:
  for:
    type: string
    required: true
    default: "empty"
    reflects: true
    constraint: >-
      The id of the object that takes the right click, looked up in the same root as the menu,
      like nph-popover (P111). The object stays outside the component and the menu writes no ARIA
      on it. An object that holds several targets, such as the rows of a table, is one object:
      the event says which element was under the pointer. Empty or matching no element in the
      same root after one frame: the menu draws nothing and emits console.error in development.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state. The menu turns it on and off by itself; the consumer may set it to show the menu
      open, at the start top corner of the object, with no focus move. A menu opened from code
      follows the object on scroll and stays until the consumer closes it. Opening and closing
      fire no event.
  items:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The entries, in order: an item (type absent or item), a label (type label,
      with text) that names the group after it, and a separator (type separator) that closes a
      group. The fields of an item are in the business rules. Without a valid item, the menu
      draws nothing and emits console.error in development.
  open-submenu:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The value of the item whose submenu is open; empty is closed. The menu writes it when the
      person opens or closes a submenu; the consumer may set it to show the submenu open. A value
      that names no enabled item with a submenu is reported in development.
  size:
    type: enum
    values: [default, compact]
    required: false
    default: default
    reflects: true
    constraint: >-
      The size of the item, set on the whole menu: one size per menu. Reflects because the
      internal CSS selects the rows by it. Any other value draws nothing and emits console.error
      in development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: "Accessible name of the menu, already localized. Empty: the menu has no name."
variants:
  severity:
    axis: appearance
    choose_when: "default for every action. destructive only for the action that deletes or ends, such as Delete: the text, the icon and the shortcut take dropdown/item-destructive-foreground. Put it last, after a separator."
    do_not_combine_with:
      - "destructive among the other actions: leave it last."
  selection:
    axis: appearance
    choose_when: "none for an action. single when only one option of the group holds at a time: the checked one shows the check at the end and its text in color/primary-hover. multiple when several hold together: the nph-checkbox box comes at the start."
    do_not_combine_with:
      - "submenu: a submenu item is not a choice."
  size:
    axis: density
    choose_when: "compact (28 px rows) on dense screens, such as tables; default (36 px rows) in the other cases. Never mix the two in one menu."
    do_not_combine_with: []
  submenu:
    axis: structure
    choose_when: "closed by default. An item with a submenu draws the arrow and carries no shortcut. The submenu opens to the right and to the left only when there is no room on the right."
    do_not_combine_with:
      - "a shortcut on the same item: the arrow takes the end of the item."
      - "a second level: a submenu has one level only."
states:
  rest:
    token: "no background; text in color/popover-foreground"
    changes_for_user: "The row is quiet; the start icon is light."
  hover:
    token: "color/primary-surface; icon in dropdown/item-hover-icon-foreground. Destructive: dropdown/item-destructive-hover-background, with the label, shortcut and icon in dropdown/item-destructive-hover-foreground"
    changes_for_user: "The row takes the surface; the start icon and the submenu arrow turn solid; the label keeps its color. The item whose submenu is open keeps this look."
  focus:
    token: "border border/width in color/primary, radius dropdown/item-focus-border-radius; halo focus/ring-width in focus/halo, radius dropdown/item-focus-halo-radius"
    changes_for_user: "For keyboard users, a border and a halo outside the row mark the focused item; the start icon turns solid."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole row loses opacity; it takes the focus but does not activate, and its icon stays light."
business_rules:
  - "An item has value and text, both required, and optionally icon, severity, selection, checked, shortcut, submenu and disabled. An invalid entry is left out, with one console.error per cause in development."
  - "An item with a submenu takes no selection and no shortcut, and its submenu holds at least one valid item and no submenu of its own. A label entry opens a group and names it; a separator entry closes the group; a group with no item is dropped, and its separator goes to the next group."
  - "The menu opens on the contextmenu event of the object (the right click, Shift+F10 or the Menu key) and cancels the menu of the browser. On touch, a press held for context-menu/long-press-delay (700 ms) opens it at the point of the press; a press that moves farther than context-menu/long-press-tolerance (10 px), or that ends before, opens nothing, and the menu of the browser that follows a touch is cancelled. The two tokens are read from the computed style, with no literal fallback: when one does not resolve, the long press does not arm and the piece logs one development error naming it."
  - "The panel opens with its start top corner at the point of the click, and turns to the other side of the point (to the left, or above) when it does not fit. It never leaves the window. Only a menu taller than the window scrolls inside. Opened by keyboard, it opens below the object, at its start edge."
  - "The submenu opens to the right of the item, with its first item on the same line as the item that opened it, and opens to the left only when there is no room on the right. In right-to-left writing, everything mirrors: the corner of the point is the top end one and the submenu opens to the left by default."
  - "When the person activates an item, the menu fires nph-item-select, which bubbles, with detail value, checked and origin: checked is the new state of a single or multiple choice and null on a common item; origin is the element that was under the pointer when the menu opened, so a row acts only on itself, and null when the menu was opened from code. A single choice already checked fires again with checked true. Changing items or open from code fires nothing."
  - "After an activation, the menu replaces items with a new list that carries the new checked, also inside a submenu; the objects of the consumer are never changed. Single choice is exclusive inside its group."
  - "A common item and a single choice close the whole menu and give the focus back to the object; a multiple choice keeps it open. An item with a submenu opens its submenu when activated."
  - "It closes with Esc (the submenu first, then the menu, which gives the focus back to the object and does not reach a dialog around it), a press outside the menu, Tab, the focus leaving it, or a scroll of the page or of a container around the object. A menu opened from code stays on scroll."
  - "A disabled item takes the focus but does not activate. Hide an action the person can never perform (permission); disable one that is unavailable now."
  - "Up to about 12 items, in short groups, with the destructive item last. The context menu never replaces the visible path: every action also exists on the screen."
  - "Opening fades in and slides space/inline-tight on motion/enter-duration and motion/enter-easing; closing on motion/exit-duration and motion/exit-easing. Under reduced motion, opacity only, on motion/hover-duration. A submenu opens by pointer after motion/hover-delay."
domain_errors: []
tokens:
  panel: [color/popover, color/popover-foreground, layout/input-width, dropdown/panel-radius, elevation/dropdown]
  panel_border: [border/width, color/dropdown-border]
  panel_padding: space/inline-tight
  group_label: [text/label-sm, color/muted-foreground, space/inline, space/inline-tight]
  separator: [dropdown/separator, space/inline-tight]
  item: [space/inline, dropdown/item-radius, text/body-md, color/popover-foreground]
  item_compact: space/inline-tight
  icon: icon/size-md
  shortcut: [text/caption, color/muted-foreground]
  arrow: icon/size-sm
  single_choice: [text/label-md, color/primary-hover]
  destructive: [dropdown/item-destructive-foreground, dropdown/item-destructive-hover-foreground, dropdown/item-destructive-hover-background]
  hover: [color/primary-surface, dropdown/item-destructive-hover-background, dropdown/item-hover-icon-foreground]
  focus: [border/width, color/primary, dropdown/item-focus-border-radius, focus/ring-width, focus/halo, dropdown/item-focus-halo-radius]
  disabled: state/disabled-opacity
  motion: [motion/enter-duration, motion/enter-easing, motion/exit-duration, motion/exit-easing, motion/hover-delay]
  long_press: [context-menu/long-press-delay, context-menu/long-press-tolerance]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-context-menu for the actions of an object the person is looking at; for actions that open from a button, use nph-dropdown-menu."
  - "Name the object with for, an id in the same root, and fill items with data: items, labels and separators."
  - "Listen to nph-item-select on the menu and read detail.value, detail.checked and detail.origin; in a table, act only on the row that origin belongs to."
  - "Repeat every action of the menu on the screen: the menu is a shortcut, never the only path."
  - "Put the destructive item last, after a separator, with an icon and a label that say the action, such as Delete."
  - "Use one size per menu; compact on a dense screen, such as a table."
  - "Do not put a shortcut on an item with a submenu, and do not nest a second submenu."
accessibility:
  semantics: "The panel is a popover in the top layer. Inside it, an element with role=menu holds the items; every group is a role=group, named by its label when it has one, because the separator is hidden from the accessibility tree. A common item is menuitem; a single choice is menuitemradio; a multiple choice is menuitemcheckbox; aria-checked follows checked. An item with a submenu carries aria-haspopup=menu and aria-expanded, and the submenu is a menu named by that item. The inner nph-checkbox is inert: the item carries the role, the state and the focus."
  accessible_name: "The menu: label. The item: its text, through aria-labelledby. The shortcut goes in aria-keyshortcuts, written in the syntax of the attribute (Ctrl becomes Control, the Command symbol becomes Meta). Icons, box, arrow and check are not read."
  keyboard:
    - "Shift+F10 and the Menu key open the menu on the first item."
    - "In the menu, the down and up arrows move, with wrap; Home and End go to the ends."
    - "A typed character goes to the next item that starts with it."
    - "Enter and Space activate the item, and open the submenu of an item that has one."
    - "The right arrow opens the submenu and the left arrow closes it, in left-to-right writing; the two swap in right-to-left."
    - "Esc closes the submenu, then the menu, and gives the focus back to the object."
    - "Tab and Shift+Tab close the menu and move on from the object."
  focus: "The focus moves to the items. Keyboard only, a border of border/width in color/primary and a halo in focus/halo show outside the row; the border carries the focus, the halo is decorative. Opened by a mouse click, the first item takes the focus without showing it. When the menu closes, the focus goes back to the object, which must be focusable for that to happen."
  contrast: "The item text passes AA on color/popover and on the hover color/primary-surface, in light and dark. The destructive item measures at least 4.69:1 on the panel in dropdown/item-destructive-foreground, also in focus, and in hover uses dropdown/item-destructive-hover-foreground on dropdown/item-destructive-hover-background. The focus border passes 3:1 against color/popover in both themes. The menu outline, the separator and the halo are decorative."
  color_alternative: "The item with a submenu has the arrow, and open it keeps the hover background. Multiple choice shows the checked box and single choice shows the check. The destructive item says the action in its label, besides the color."
invalid_combinations:
  - "submenu with a selection other than none — a submenu item is not a choice; the item is left out."
  - "submenu with a shortcut — the arrow takes the end of the item; the item is left out."
  - "an item inside a submenu that has a submenu — one level only; the item is left out."
  - "an item without value or text — it has no name or nothing to report; the item is left out."
  - "for empty or matching nothing — the menu has no object and draws nothing."
relations:
  combines_with: [nph-icon, nph-checkbox, nph-separator, nph-data-table]
  parents: ["a file", "a table row", "a card", "a list item"]
  children: [nph-icon, nph-checkbox, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Making the context menu the only path to an action."
  - "Putting the destructive item among the other actions."
  - "Putting a shortcut on an item with a submenu."
  - "Mixing the default and compact sizes in one menu."
  - "Nesting a second level of submenu."
  - "Listing many actions: use a screen or a dialog."
sources:
  design_md: "design.md, color/popover, color/popover-foreground, color/dropdown-border, color/border-subtle, color/primary-surface, color/primary-hover, color/muted-foreground, color/destructive-text, dropdown/*, layout/input-width, elevation/dropdown, space/inline, space/inline-tight, icon/size-md, icon/size-sm, text/body-md, text/caption, text/label-sm, text/label-md, focus/ring-width, focus/halo, state/disabled-opacity and motion/*"
  decision: "P113 — API and semantics of nph-context-menu"
  tests: "src/components/nph-context-menu/nph-context-menu.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-context-menu/nph-context-menu.stories.ts and nph-context-menu.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Context Menu (4128:17776), documentation frame 4838:27591, set nph-context-menu 4819:15828"
---

# nph-context-menu

## Function

**The problem it solves:** shows the actions of the object under the pointer — a file, a table row,
a card — in a menu that opens at the point of the right click. It is a shortcut to the actions of an
object the person is already looking at. It complements the visible path and never replaces it:
whoever does not use the right button needs to find the same action on the screen.

**When to use:**

- For frequent actions on an object the person is already looking at, such as a file, a table row
  or a card.
- For few actions in short groups, with the destructive item last, after a separator.
- The default size on most screens; the compact size on dense screens, such as tables.
- A submenu of one level only, for actions that unfold, such as Share.

**When NOT to use:**

- **As the only path to an action** — every action of the menu also exists on the screen.
- **For many actions** — use a screen or a dialog.
- **For actions that open from a visible button** — use `nph-dropdown-menu`.
- **For actions that must stay always in view** — use a toolbar.

## Variants

**By appearance:** the type of the item, `severity`, and its choice, `selection`.

| Variant | Choose when |
|---|---|
| `severity` `default` | Every action |
| `severity` `destructive` | Only the action that deletes or ends, such as Delete; last, after a separator |
| `selection` `none` | An action |
| `selection` `single` | Only one option of the group holds at a time; the checked one shows the check |
| `selection` `multiple` | Several options hold together; the box comes at the start |

**By size:** not applicable to the piece; the density is `size` on the whole menu.

**By density:** `size`, one per menu: `compact` (28 px rows) on dense screens, `default` (36 px rows)
in the other cases. A multiple choice row is 40 px, the touch area of the box. The compact size also
takes the destructive item, with the color change only.

**By structure:** an item with a submenu draws the arrow and carries no shortcut. The submenu has one
level, opens to the right and opens to the left only when there is no room.

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

**Choose this variant when:** the tables above say it.

**Do not combine with:** a submenu with a selection or a shortcut; a submenu inside a submenu.

## States

| State | Token | What changes for the person |
|---|---|---|
| Rest | no background; text in `color/popover-foreground` | The row is quiet; the start icon is light |
| Hover | `color/primary-surface`; icon in `dropdown/item-hover-icon-foreground`. Destructive: `dropdown/item-destructive-hover-background`, with the label, shortcut and icon in `dropdown/item-destructive-hover-foreground` | The row takes the surface; the start icon and the submenu arrow turn solid; the label keeps its color. The item whose submenu is open keeps this look |
| Focus | border `border/width` in `color/primary`, radius `dropdown/item-focus-border-radius`; halo `focus/ring-width` in `focus/halo`, radius `dropdown/item-focus-halo-radius` | For keyboard users, a border and a halo outside the row; the start icon turns solid |
| Disabled | `state/disabled-opacity` | The whole row loses opacity; it takes the focus but does not activate; its icon stays light |

**Feedback and focus:** focus appears only for keyboard users and **is not removed**. The start icon
is light at rest and when disabled, and solid on highlight, in every type, selection and size.

**Business rule the piece carries:**

- The menu opens on `contextmenu` (the right click, Shift+F10, the Menu key) and cancels the menu of
  the browser; on touch, a press held for `context-menu/long-press-delay` (700 ms) that moves no farther
  than `context-menu/long-press-tolerance` (10 px) opens it at the point of the press. The two tokens are
  read from the computed style; when one does not resolve, the long press does not arm and the piece
  logs one development error naming it.
- The panel opens with its start top corner at the point and turns to the other side of it when it
  does not fit; it never leaves the window.
- When the person activates an item, the menu fires `nph-item-select`, which bubbles, with
  `detail.value`, `detail.checked` (`null` on a common item) and `detail.origin`, the element that was
  under the pointer. Changing `items` or `open` from code fires nothing.
- After an activation, the menu replaces `items` with a new list that carries the new `checked`; the
  objects of the consumer are never changed.
- A common item and a single choice close the menu and give the focus back to the object; a multiple
  choice keeps it open.
- Esc closes the submenu and then the menu. A click outside, Tab, the focus leaving and a scroll of
  the page close it.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A popover panel with a `role=menu` inside; every group is a `role=group`, named by its label when it has one. Items are `menuitem`, `menuitemradio` (single choice) or `menuitemcheckbox` (multiple choice), with `aria-checked`. An item with a submenu carries `aria-haspopup` and `aria-expanded`, and its submenu is a menu named by it. The inner `nph-checkbox` is `inert` |
| Accessible name | The menu: `label`. The item: its `text`. The shortcut goes in `aria-keyshortcuts`. Support icons and the arrow are not read |
| Keyboard | The menu pattern of the APG: Shift+F10 and the Menu key open on the first item; ↑ ↓ with wrap, Home, End, a typed character, Enter and Space activate, → opens the submenu and ← closes it (swapped in right-to-left), Esc closes the submenu and then the menu and gives the focus back, Tab closes and moves on |
| Focus | The `color/primary` border carries the focus; the halo is decorative. Opened by a mouse click, the first item has the focus but does not show it |
| Contrast | The item text passes AA on `color/popover` and on `color/primary-surface`; the destructive item measures at least 4.69:1 in `dropdown/item-destructive-foreground` |
| Alternative to color | The item with a submenu has the arrow; multiple choice shows the box and single choice the check; the destructive item says the action in its label |
| Touch target | The whole row, above 24 by 24 in both sizes; the panel takes the width of `layout/input-width` |
| Known limits | When the object is not focusable, such as a table row, the focus cannot go back to it on close and stays where the browser leaves it. The menu is not a replacement for the visible path: a person who does not use the right button, a long press or Shift+F10 needs the same action on the screen. A forced-colors mode is not handled. A nested menu beyond one level is out of scope |

## Relations

**Combines with:** `nph-icon` (the start icon, the arrow and the check), `nph-checkbox` (multiple
choice) and `nph-separator`; the item, the group label and the separator take the look of
`nph-dropdown-menu` through its `dropdown/*` tokens.

**What is the parent:** a file, a table row (`nph-data-table`), a card or a list item, which is the
object named by `for`.

**What is the child:** `nph-icon`, `nph-checkbox` and `nph-separator`, drawn by the menu. The item is
not a tag of its own.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Panel | `color/popover`, `layout/input-width`, `dropdown/panel-radius`, `elevation/dropdown`, padding `space/inline-tight` |
| Panel border | `border/width` in `color/dropdown-border`, which resolves to `color/border-subtle` |
| Group label | `text/label-sm` in `color/muted-foreground`, `space/inline` on the sides, `space/inline-tight` above and below |
| Separator | `nph-separator` in `dropdown/separator`, `space/inline-tight` above and below |
| Item | `space/inline` padding and gap (`space/inline-tight` above and below in compact), `dropdown/item-radius`, `text/body-md` in `color/popover-foreground` |
| Shortcut | `text/caption` in `color/muted-foreground` |
| Single choice | `text/label-md` in `color/primary-hover`; check solid at `icon/size-sm` |
| Destructive | `dropdown/item-destructive-foreground`; hover `dropdown/item-destructive-hover-foreground` on `dropdown/item-destructive-hover-background` |
| Hover | `color/primary-surface`, `dropdown/item-destructive-hover-background`, `dropdown/item-hover-icon-foreground` |
| Focus | `border/width`, `color/primary`, `dropdown/item-focus-border-radius`, `focus/ring-width`, `focus/halo`, `dropdown/item-focus-halo-radius` |
| Disabled | `state/disabled-opacity` |
| Motion | `motion/enter-*` and `motion/exit-*`; `motion/hover-delay` for the submenu; `motion/hover-duration` under reduced motion |
| Long press | `context-menu/long-press-delay` (how long a touch is held) and `context-menu/long-press-tolerance` (how far it may move), read by the code from the computed style |

**Usage restrictions:** the component has only the two tokens of the long press as its own and does
not choose width, height, color, radius or typography: everything comes from a token. The row height comes from its content. In
a part of the screen with another brand, `data-nph-brand` and `data-nph-color-scheme` go on the same
element (P67).

**AI hints:**

- Use `nph-context-menu` for the actions of an object the person is looking at; for actions that open
  from a button, use `nph-dropdown-menu`.
- Name the object with `for`, an id in the same root, and fill `items` with data: items, labels and
  separators.
- Listen to `nph-item-select` on the menu and read `detail.value`, `detail.checked` and
  `detail.origin`; in a table, act only on the row that `origin` belongs to.
- Repeat every action of the menu on the screen: the menu is a shortcut, never the only path.
- Put the destructive item last, after a separator, with an icon and a label that say the action,
  such as Delete.
- Use one size per menu; compact on a dense screen, such as a table.
- Do not put a shortcut on an item with a submenu, and do not nest a second submenu.

## Examples

**Recommended case:** a file menu — Back, Reload, Copy link and Edit with their shortcuts, Share with
a submenu of Copy link, Download file and More options, a separator and the destructive Delete last.

**Alternative case:** the same menu, compact, on a table row, with the submenu opening to the left
when the row is near the end of the window; or a view menu with single choice and multiple choice.

## Anti-patterns

- **Do not make the context menu the only path to an action** — the same action exists on the screen.
- **Do not put the destructive item among the other actions** — leave it last, after a separator.
- **Do not put a shortcut on an item with a submenu** — the arrow takes the end of the item.
- **Do not mix the default and compact sizes in one menu** — use one size only.
- **Do not nest a second submenu** — one level only.
- **Do not list many actions** — use a screen or a dialog.
- **Invalid combinations:** a submenu with a selection or a shortcut; a submenu inside a submenu; an
  item without `value` or `text`; `for` empty or matching nothing.

## Sources and decisions

- **The repository `design.md`:** the tokens of the table above, with `color/destructive-text` and
  the `dropdown/*` tokens, taken with this piece.
- **The decision that originated it:** P113. The documentation was accepted by Indiane on 06-11-2026.
- **Tests:** `src/components/nph-context-menu/nph-context-menu.test.ts`.
- **Usage evidence:** no screen consumes it yet.
