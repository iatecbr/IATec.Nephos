---
piece: nph-popconfirm
level: component
status: active
solves: >-
  Asks, in a short surface anchored to a trigger, a question about the action the person just
  requested and offers two ways out, Cancel and the verb of the result, so they confirm or give up
  without leaving the place.
use_when:
  - "When the action comes from an item of the page, fits a short question and can be undone, even with effort, or loses little: delete a row that goes to the trash, leave the editing of one item with changes, send a request."
  - "Choose the type by the consequence: default for a step that changes the state, warning when a small piece of work may be lost, destructive when something goes away."
  - "Choose no arrow by default; use the arrow when the trigger sits among other buttons."
  - "Choose sm by default; use md when the question and the consequence need more width."
  - "Turn the description off only when the title already says the consequence."
do_not_use_when:
  - "For a serious or irreversible action, or one that needs a long explanation: use nph-dialog, with a danger button."
  - "For a form or a setting: use nph-popover."
  - "For a light action that is undone right away, such as archiving: do the action and offer Undo in nph-notification."
  - "For a list of commands: use nph-dropdown-menu."
  - "With Yes and No on the buttons: use Cancel and the verb of the result."
  - "With the default type to delete: use the destructive type."
  - "Inside a dialog: not part of the contract yet."
api:
  for:
    type: string
    required: true
    default: "empty"
    reflects: true
    constraint: >-
      The id of the element that opens the popconfirm, looked up in the same root as the
      popconfirm, like the for of nph-popover. The trigger stays outside the component. The
      popconfirm writes aria-haspopup dialog, aria-expanded and aria-controls on it. A for that is
      empty or matches no element in that root draws nothing and emits console.error in
      development. A disabled, aria-disabled or loading trigger opens nothing.
  open:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The state. The trigger turns it on and off; the consumer may set it, and setting it to false
      is how a slow confirm closes on success. Setting it from code never fires nph-confirm or
      nph-cancel.
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title, already localized: the question about the action. Always visible; it is the
      accessible name of the alertdialog. Empty draws nothing and emits console.error in
      development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The consequence, already localized. It describes the alertdialog for the screen reader.
      Empty draws no description, and the title is the whole message.
  type:
    type: enum
    values: [default, warning, destructive]
    required: false
    default: default
    reflects: true
    constraint: >-
      Chosen by the consequence. It changes the icon glyph, the background of the icon box, the
      Confirm button (primary solid in default and warning, danger solid in destructive) and the
      button that takes the focus on open. A value outside the list draws nothing and emits
      console.error in development.
  size:
    type: enum
    values: [sm, md]
    required: false
    default: sm
    reflects: true
    constraint: >-
      Changes the width (popconfirm/width-sm or popconfirm/width-md), the padding, the title
      style and the icon box. The height follows the content. The buttons are the default height
      in both sizes. A value outside the list draws nothing and emits console.error in
      development.
  side:
    type: enum
    values: [bottom, top, right, left]
    required: false
    default: bottom
    reflects: true
    constraint: >-
      Where the surface opens relative to the trigger. It turns to the opposite side when the one
      asked for does not fit and the opposite has more room, and never leaves the window. The
      sides are physical. A value outside the list draws nothing and emits console.error in
      development.
  align:
    type: enum
    values: [start, center, end]
    required: false
    default: center
    reflects: true
    constraint: >-
      How the surface aligns to the trigger on that side. On the top and bottom sides, start and
      end follow the writing direction; on the left and right sides, start is the top and end the
      bottom. A value outside the list draws nothing and emits console.error in development.
  arrow:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      An arrow that points to the trigger, decorative. Off by default. With the arrow, the surface
      sits one arrow height further from the trigger, so the tip keeps popconfirm/offset from it.
  hide-icon:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Turns the type icon and its box off (the Figma boolean icon, on by default). The property is
      true to hide, because a boolean attribute cannot start on and be turned off.
  confirm-label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The text of the Confirm button, already localized: the verb of the result, such as Delete or
      Send. Never Yes. Empty draws nothing and emits console.error in development.
  cancel-label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The text of the Cancel button, already localized. Empty draws nothing and emits
      console.error in development.
  loading:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Confirm is running: it takes the loading state of nph-button and the surface stays open. A
      press on a loading Confirm does nothing. Cancel stays enabled. The consumer sets it and
      clears it.
  return-focus-to:
    type: property
    required: false
    default: "null"
    reflects: false
    constraint: >-
      Property only, an HTMLElement. Where the focus goes on close when the trigger is gone, for
      instance the next row after a delete. Used only when the trigger is no longer in the page;
      otherwise the focus goes to the trigger. Without it, the focus is left to the browser. If the
      popconfirm itself leaves the page, the consumer places the focus.
  nph-confirm:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Bubbles, composed, cancelable, fired when Confirm is pressed and it is not loading. Unless
      preventDefault is called, the popconfirm closes. A slow confirm calls preventDefault, sets
      loading and, on success, sets open to false. On failure it clears loading and stays open.
  nph-cancel:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Bubbles, composed, with detail source cancel-button, escape, outside, trigger or
      other-layer, fired before it closes when the person gives up. It is cancelable, except for
      other-layer. It also fires while Confirm loads, and the component does not undo the request
      already sent: the consumer decides what to do with it.
variants:
  type:
    axis: appearance
    choose_when: "default for a step that changes the state, such as sending; warning when a small piece of work may be lost, such as the editing of one item; destructive when something goes away. Keep destructive for what goes away, or the danger Confirm loses strength."
    do_not_combine_with: ["the default type to delete", "a type for a serious or irreversible action: use nph-dialog"]
  size:
    axis: size
    choose_when: "sm, the default, for a short question and consequence; md when they need more width."
    do_not_combine_with: ["a size outside the list"]
  placement:
    axis: position
    choose_when: "bottom, the default, unless the layout asks for another side; center, the default, unless the surface should start or end where the trigger does. The popconfirm turns to the opposite side by itself when the one asked for does not fit."
    do_not_combine_with: ["a side or an alignment outside the lists"]
  arrow:
    axis: appearance
    choose_when: "Off, the default, because the link to the trigger is already clear by proximity; on when the trigger sits among other buttons."
    do_not_combine_with: []
  parts:
    axis: content
    choose_when: "Icon and description on by default. Turn the description off only when the title already says the consequence."
    do_not_combine_with: ["an action with no title: the title is the question and is required"]
states:
  closed:
    token: "none"
    changes_for_user: "Only the trigger shows."
  open:
    token: "popconfirm/background, popconfirm/border, popconfirm/radius, elevation/dropdown"
    changes_for_user: "The surface shows anchored to the trigger, the trigger carries aria-expanded true and draws the hover-active look of its own component, and the focus goes to Cancel in warning and destructive or to Confirm in default."
  trigger-open:
    token: "button/secondary-solid-background-hover"
    changes_for_user: "The nph-button trigger keeps the look of hover-active while the popconfirm is open. It is an extra signal; aria-expanded is the one that says it is open."
  confirm-loading:
    token: "the loading state of nph-button"
    changes_for_user: "Confirm shows the spinner and ignores presses; the surface stays open and Cancel stays enabled."
  actions-stacked:
    token: "popconfirm/actions-gap"
    changes_for_user: "When the two buttons do not fit side by side, they stack in a column, Confirm on top and Cancel below, each at the full width of the band. The surface keeps its width."
business_rules:
  - "The popconfirm is not modal: the page stays usable. It closes with Cancel, Esc, a press outside, the trigger pressed again, another layer taking the focus or the confirmed action."
  - "Tab and Shift+Tab move only between Cancel and Confirm while it is open, in the order they appear on screen."
  - "On open, the focus goes to Cancel in warning and destructive, and to Confirm in default."
  - "Esc, Cancel and Confirm give the focus back to the trigger, or to return-focus-to when the trigger is gone. A press outside leaves the focus where the person pressed."
  - "Esc closes only the popconfirm and does not reach a dialog around it. With more than one open it belongs to the last one shown."
  - "One layer at a time: the one that opens takes the focus, and the focus leaving the open one closes it as other-layer, also while its Confirm loads."
  - "While Confirm loads, Cancel, Esc, a press outside and another layer close the surface; the consumer hears the source on nph-cancel."
  - "While the surface leaves it is inert: it takes no focus and no click."
  - "The surface does not clip its content, so the focus ring of a button is whole. Its width is fixed by the size and never goes beyond the window minus its margin; the text wraps."
  - "The divider is always on, because there are always two actions."
  - "The primary Confirm sets the focus border hook of nph-button to focus/border, so the focus keeps its contrast on the dark surface in every brand. The danger Confirm and Cancel keep their own."
  - "Every text comes from the consumer, already localized: the piece writes no word of its own."
domain_errors:
  - "A for that is empty or matches no element in the same root of the popconfirm: it draws nothing and emits console.error in development."
  - "An empty heading, confirm-label or cancel-label, or a type, a size, a side or an align outside the lists: it draws nothing and emits console.error in development, one per cause."
tokens:
  surface: "popconfirm/background, popconfirm/border, popconfirm/border-width, popconfirm/radius, elevation/dropdown"
  title_and_description: "popconfirm/title-foreground, popconfirm/description-foreground, text/heading-sm, text/heading-md, text/body-md"
  spacing: "popconfirm/padding-sm, popconfirm/padding-md, popconfirm/icon-gap, popconfirm/text-gap, popconfirm/actions-gap, popconfirm/footer-padding-sm, popconfirm/footer-padding-md"
  icon: "popconfirm/icon-size-sm, popconfirm/icon-size-md, popconfirm/icon-box-padding, popconfirm/icon-box-radius, popconfirm/icon-box-background, popconfirm/icon-box-background-warning, popconfirm/icon-box-background-destructive, popconfirm/icon-foreground, popconfirm/icon-foreground-warning, popconfirm/icon-foreground-destructive"
  divider: "popconfirm/divider, popconfirm/border-width"
  width: "popconfirm/width-sm, popconfirm/width-md, layout/margin-compact"
  position: "popconfirm/offset"
  arrow: "popconfirm/arrow-width, popconfirm/arrow-height, popconfirm/arrow-inset, popconfirm/background, popconfirm/border"
  motion: "popconfirm/enter-duration, popconfirm/exit-duration, motion/enter-easing, motion/exit-easing"
  focus: "focus/border"
ai_hints:
  - "Use nph-popconfirm to confirm, without leaving the place, an action of low to medium risk tied to an item of the page; for a serious or irreversible action use nph-dialog with a danger button, and for a form or a setting use nph-popover."
  - "Give for with the id of the trigger, an nph-button secondary solid, and heading with the question about the action."
  - "Write confirm-label with the verb of the result, such as Delete or Send, and never Yes and No."
  - "Choose type by the consequence, and keep destructive for what goes away."
  - "Close it from a slow confirm by calling preventDefault on nph-confirm, setting loading, and setting open to false on success."
  - "Set return-focus-to to the next row when the confirmed action removes the trigger."
  - "Prefer no arrow; use it only when the trigger sits among other buttons."
  - "Do not put a popconfirm inside a dialog: it is not part of the contract yet."
accessibility:
  semantics: "The surface is an alertdialog with no aria-modal, named by the title through aria-labelledby and described by the description through aria-describedby. The trigger carries aria-haspopup dialog, aria-expanded and aria-controls, the last one pointing to the popconfirm host, because an id reference does not cross a shadow root. The icon and the arrow are decorative (aria-hidden)."
  accessible_name: "The surface: heading. The description: description. Cancel and Confirm: cancel-label and confirm-label. The trigger: its own text or aria-label."
  keyboard:
    - "Enter and Space on the trigger open the popconfirm; it never opens by hover or by focus."
    - "Tab and Shift+Tab move only between Cancel and Confirm, in the order they appear on screen."
    - "Enter or Space activate the focused button."
    - "Esc closes it as Cancel and gives the focus back to the trigger, and does not reach a dialog around it."
  focus: "On open, the focus goes to Cancel in warning and destructive and to Confirm in default, the least destructive action first. Each button shows the focus ring of nph-button; the surface takes no ring. On a press outside the focus stays where the person pressed."
  contrast: "Title and description pass 4.5:1 over the surface in both themes. Each type icon passes 3:1 over the box of its type. The border and the divider are decorative: in light the surface stands apart by the shadow, in dark by the lighter background."
  color_alternative: "The type does not depend on color: the glyph separates a question from an alert, and Confirm says the verb of the result. Open, the trigger carries aria-expanded true; the hover-active look is an extra signal."
invalid_combinations:
  - "A type, a size, a side or an align outside the lists."
  - "A for that matches no element in the same root as the popconfirm."
  - "An empty heading, confirm-label or cancel-label."
  - "Yes and No as the labels of the buttons."
relations:
  combines_with: [nph-button, nph-icon, nph-separator]
  parents: ["a page, a table row, a list item or a toolbar, next to its trigger"]
  children: [nph-button, nph-icon, nph-separator]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it for a serious or irreversible action, or one that needs a long explanation."
  - "Using the default type to delete."
  - "Using Yes and No on the buttons."
  - "Using it for a light action that is undone right away, instead of Undo in nph-notification."
  - "Using a trigger that is not an nph-button, or leaving the trigger without an accessible name."
  - "Setting open to false from a slow confirm before the request ends, which hides a failure."
sources:
  design_md: "design.md, the popconfirm/* tokens, color/popover, color/popover-foreground, color/muted-foreground, color/border-subtle, status/info, status/warning, color/destructive-on-surface, radius/inset, focus/border, elevation/dropdown and the text styles"
  decision: "P137 — nph-popconfirm: API and semantics"
  tests: "src/components/nph-popconfirm/nph-popconfirm.test.ts"
  usage_evidence: "no screen consumes it yet"
  storybook: "src/components/nph-popconfirm/nph-popconfirm.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-popconfirm documentation 7389:104, set 7222:3568"
---

# nph-popconfirm

## Function

**The problem it solves:** asks, in a short surface anchored to a trigger, a question about the action
the person just requested, and offers two ways out: Cancel and the verb of the result. The person
confirms or gives up without leaving the place.

**When to use:**

- When the action comes from an item of the page, fits a short question and can be undone, even with
  effort, or loses little: delete a row that goes to the trash, leave the editing of one item with
  changes, send a request.
- Choose the type by the consequence: `default` for a step that changes the state, `warning` when a
  small piece of work may be lost, `destructive` when something goes away.
- Choose no arrow by default; use the arrow when the trigger sits among other buttons.
- Choose `sm` by default; use `md` when the question and the consequence need more width.
- Turn the description off only when the title already says the consequence.

**When NOT to use:**

- **For a serious or irreversible action, or one that needs a long explanation** — use `nph-dialog`,
  with a danger button.
- **For a form or a setting** — use `nph-popover`.
- **For a light action that is undone right away, such as archiving** — do the action and offer Undo in
  `nph-notification`.
- **For a list of commands** — use `nph-dropdown-menu`.
- **With Yes and No on the buttons** — use Cancel and the verb of the result.
- **With the default type to delete** — use the destructive type.
- **Inside a dialog** — not part of the contract yet.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| Type | `default`, `warning`, `destructive` | By the consequence of the action; keep `destructive` for what goes away |
| Size | `sm`, `md` | `sm` by default; `md` when the question and the consequence need more width |
| Side | `bottom`, `top`, `right`, `left` | `bottom` unless the layout asks for another; it turns to the opposite side by itself when the one asked for does not fit |
| Alignment | `start`, `center`, `end` | `center` unless the surface should start or end where the trigger does |
| Arrow | off, on | Off by default; on when the trigger sits among other buttons |
| Icon, description | on, off | Both on by default; the title and the two actions are always there |

The type is the Figma property `tipo`, with `padrao`, `aviso` and `destrutivo`; the side is `lado`;
the alignment is `alinhamento`; the arrow is `seta`, with `sem` (without) and `com` (with); the size is
`tamanho`. The parts are the Figma booleans `ícone` and `descrição`; the texts are `texto do título` and
`texto da descrição`. Without the arrow, the Figma set varies the type and the size, and the code
resolves the position; with the arrow, it varies type, side and alignment, at size `sm`.

**By size and density:** the size changes the width, the padding of the content and of the actions
band, the title style (`text/heading-sm` or `text/heading-md`), the icon and its box. The buttons are
the default height in both sizes.

**Do not combine with:** a value outside the lists; Yes and No on the buttons; the default type to
delete.

## States

| Part | State | Token | What changes for the person |
|---|---|---|---|
| Popconfirm | Closed | none | Only the trigger shows |
| Popconfirm | Open | `popconfirm/background`, `popconfirm/border`, `popconfirm/radius`, `elevation/dropdown` | The surface shows anchored to the trigger; the focus goes to a button |
| Trigger | Open | `button/secondary-solid-background-hover` | The `nph-button` trigger keeps the look of hover-active and carries `aria-expanded` true |
| Confirm | Loading | the loading state of `nph-button` | The spinner shows and a press does nothing; the surface stays open and Cancel stays enabled |
| Actions | Stacked | `popconfirm/actions-gap` | The two buttons go into a column, Confirm on top, each at the full width of the band |

Closed, only the trigger shows; open, the trigger and the surface show. In Figma, open and closed are
not properties of the set. Focus has no token of its own: each button shows the focus ring of
`nph-button`, and the surface takes none.

**Feedback and focus:** on open, the focus goes to the least destructive action: Cancel in `warning` and
`destructive`, Confirm in `default`. On close it goes back to the trigger, or to `return-focus-to` when
the trigger is gone; after a press outside it stays where the person pressed. The surface enters with
`popconfirm/enter-duration` and leaves with `popconfirm/exit-duration`; with reduced motion there is no
animation.

**Business rule the piece carries:**

- The popconfirm is not modal: the page stays usable. It closes with Cancel, Esc, a press outside, the
  trigger pressed again, another layer taking the focus or the confirmed action.
- Tab and Shift+Tab move only between Cancel and Confirm, in the order they appear on screen: Cancel,
  then Confirm side by side; Confirm, then Cancel when stacked.
- Slow confirm: the consumer calls `preventDefault` on `nph-confirm`, sets `loading`, and sets `open` to
  `false` on success. On failure it clears `loading` and the surface stays open. The component does not
  undo the request already sent.
- While Confirm loads, Cancel, Esc, a press outside and another layer close the surface, and the
  consumer hears the source on `nph-cancel`.
- One layer at a time: the one that opens takes the focus, and the focus leaving the open one closes it
  as `other-layer`.
- Esc closes only the popconfirm: it does not reach a dialog around it. With more than one open it
  belongs to the last one shown.
- While the surface leaves it is inert: it takes no focus and no click.
- The surface does not clip its content. Its width is fixed by the size and never goes beyond the
  window minus `layout/margin-compact` on each side; the text wraps.
- The divider is always on, because there are always two actions. Its line is `popconfirm/divider`,
  `border/width` thick, drawn through the `nph-separator` it holds with the color set in scope.
- The primary Confirm sets `--nph-button-focus-border` to `focus/border`; the danger Confirm and Cancel
  keep the focus border of their own severity.
- Every text comes from the consumer, already localized: the piece writes no word of its own.

**Domain error states:** a `for` that is empty or matches no element in the same root, an empty
`heading`, `confirm-label` or `cancel-label`, or a value outside the lists draws nothing and emits
`console.error` in development, one per cause.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The surface is an `alertdialog` with no `aria-modal`, named by the title through `aria-labelledby` and described by the description through `aria-describedby`. The trigger carries `aria-haspopup` dialog, `aria-expanded` and `aria-controls`; the last points to the popconfirm host, because an id reference does not cross a shadow root. The icon and the arrow are decorative (`aria-hidden`) |
| Accessible name | The surface: `heading`. The description: `description`. The buttons: `cancel-label` and `confirm-label`. The trigger: its own text or `aria-label` |
| Keyboard | Enter and Space on the trigger open it; hover and focus never do. Tab and Shift+Tab move only between Cancel and Confirm. Esc closes it as Cancel and gives the focus back to the trigger |
| Focus | On open, Cancel in `warning` and `destructive`, Confirm in `default`. Each button shows the focus ring of `nph-button`; the surface takes no ring |
| Contrast | Title and description pass 4.5:1 over the surface in both themes. The type icon passes 3:1 over its box. The border and the divider are decorative |
| Alternative to color | The glyph separates a question from an alert, and Confirm says the verb of the result. The type does not rely on color alone |
| Touch target | The trigger, Cancel and Confirm are 36 tall, above the 24 by 24 minimum |
| Known limits | (a) The alertdialog has no `aria-modal` and keeps the Tab between the two buttons, as the PrimeNG ConfirmPopup does; this departs from the APG, which treats the alertdialog as modal, and its reading in NVDA, JAWS and VoiceOver has no read source. (b) A press on an area with no focusable element leaves the focus where the browser puts it; there is no read source. (c) In dark, in brands where `color/primary` is below 3:1 on the surface, the focus border of the primary Confirm is set to `focus/border` by this piece; the `nph-button` itself is fixed in a task of its own. (d) A single label longer than the actions band stays on one line inside `nph-button`, which keeps `nowrap`; it needs a change in `nph-button`. (e) A window smaller than the layer: it stays beside the trigger and the window cuts it. (f) A popconfirm inside a dialog is out of scope. (g) The popconfirm does not constrain its height |

## Relations

**Combines with:** `nph-button`, the trigger, Cancel and Confirm; `nph-icon`, the type icon;
`nph-separator`, the divider.

**What is the parent:** a page, a table row, a list item or a toolbar, next to its trigger. The
popconfirm sits beside its trigger in the DOM and finds it by `for`.

**What is the child:** `nph-icon`, `nph-separator` and the two `nph-button`, all drawn by the piece. It
takes no slot: the texts come by property.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Surface | `popconfirm/background`, `popconfirm/border`, `popconfirm/border-width`, `popconfirm/radius`, `elevation/dropdown` |
| Title and description | `popconfirm/title-foreground`, `popconfirm/description-foreground`, `text/heading-sm`, `text/heading-md`, `text/body-md` |
| Spacing | `popconfirm/padding-sm`, `popconfirm/padding-md`, `popconfirm/icon-gap`, `popconfirm/text-gap`, `popconfirm/actions-gap`, `popconfirm/footer-padding-sm`, `popconfirm/footer-padding-md` |
| Icon box | `popconfirm/icon-box-padding`, `popconfirm/icon-box-radius`, `popconfirm/icon-box-background`, `popconfirm/icon-box-background-warning`, `popconfirm/icon-box-background-destructive` |
| Icon | `popconfirm/icon-size-sm`, `popconfirm/icon-size-md`, `popconfirm/icon-foreground`, `popconfirm/icon-foreground-warning`, `popconfirm/icon-foreground-destructive` |
| Divider | `popconfirm/divider`, `popconfirm/border-width` |
| Width | `popconfirm/width-sm`, `popconfirm/width-md`, `layout/margin-compact` |
| Distance to the trigger | `popconfirm/offset` |
| Arrow | `popconfirm/arrow-width`, `popconfirm/arrow-height`, `popconfirm/arrow-inset` |
| Motion | `popconfirm/enter-duration`, `popconfirm/exit-duration`, `motion/enter-easing`, `motion/exit-easing` |
| Focus of the primary Confirm | `focus/border` |

**Usage restrictions:** the piece does not choose color, radius, size or typography: everything comes
from a token, and the shadow is the `elevation/dropdown` style, with no token of its own. There is no
`popconfirm/*` easing token: the easing is `motion/enter-easing` and `motion/exit-easing`, as in
`nph-popover`. The piece has no `::part`, no slot and no color property.

**AI hints:**

- Use `nph-popconfirm` to confirm, without leaving the place, an action of low to medium risk tied to an
  item of the page; for a serious or irreversible action use `nph-dialog` with a danger button, and for a
  form or a setting use `nph-popover`.
- Give `for` with the id of the trigger, an `nph-button` secondary solid, and `heading` with the question
  about the action.
- Write `confirm-label` with the verb of the result, such as Delete or Send, and never Yes and No.
- Choose `type` by the consequence, and keep `destructive` for what goes away.
- Close it from a slow confirm by calling `preventDefault` on `nph-confirm`, setting `loading`, and
  setting `open` to `false` on success.
- Set `return-focus-to` to the next row when the confirmed action removes the trigger.
- Prefer no arrow; use it only when the trigger sits among other buttons.
- Do not put a popconfirm inside a dialog: it is not part of the contract yet.

## Examples

**Recommended case:** delete a spreadsheet from the list, recoverable from the trash: destructive type,
`md`, the title "Delete the March spreadsheet?", the consequence in the description, Confirm "Delete",
and the focus on Cancel.

**Alternative case:** leave the editing of one item with changes, warning type, `sm`; and send a request
for approval, default type, `sm`, no arrow.

## Anti-patterns

- **Do not use Yes and No on the buttons** — use Cancel and the verb of the result, such as Delete.
- **Do not use the default type to delete** — use the destructive type, with the alert icon and the
  danger Confirm.
- **Do not use it for a light action that is undone right away** — do the action and offer Undo in
  `nph-notification`.
- **Do not use it for a serious or irreversible action, or one with a long explanation** — use
  `nph-dialog` with a danger button.
- **Do not leave the trigger without a name** — give it text or `aria-label`.
- **Do not set `open` to `false` from a slow confirm before the request ends** — it hides a failure.
- **Invalid combinations:** a value outside the lists; an empty `heading`, `confirm-label` or
  `cancel-label`; a `for` that matches no element in the same root.
- **Do not create without a decision:** a popconfirm inside a dialog, a variant of `nph-button` for the
  open trigger, a color property, a token of its own for the easing.

## Sources and decisions

- **The repository `design.md`:** the `popconfirm/*` tokens, the colors they point to,
  `elevation/dropdown` and the text styles.
- **The decision that originated it:** P137.
- **Tests:** `src/components/nph-popconfirm/nph-popconfirm.test.ts`.
- **Usage evidence:** no screen consumes it yet.
- **Storybook:** `src/components/nph-popconfirm/nph-popconfirm.stories.ts`.
- **Figma:** the `nph-popconfirm` documentation frame (`7389:104`) and the set `7222:3568` in
  `DS-IA-NEPHOS 5.0`.
