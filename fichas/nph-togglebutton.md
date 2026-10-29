---
piece: nph-togglebutton
level: component
status: active
solves: >-
  Gives the person a button that holds a boolean value, on or off, with text or with
  an icon only, and shows the state in the piece itself.
use_when:
  - "In a toolbar, when the option turns on or off with an immediate effect, among other buttons."
  - "With text, when the option name must be visible."
  - "Icon only, when the icon is recognized without a caption: give it an accessible name."
  - "One icon at most, at the start by default: without an icon, the background and the label color still show the state."
do_not_use_when:
  - "To fire an action: use nph-button."
  - "Outside a toolbar, in a setting that turns on or off with an immediate effect: use nph-switch."
  - "In a form, when the choice goes with the submission: use nph-checkbox."
  - "To mark the state by changing only the text color: turn pressed on."
api:
  pressed:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property marcado. Reflects because the internal CSS selects the
      state by it. A click, Enter or Space by the person toggles it and fires
      nph-change; setting it from code never fires the event. The name and the
      mapping from marcado are a technical proposal of P73.
  invalid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma invalid property. The border becomes status/error and, on focus,
      the halo becomes focus/halo-error. Reflects because the internal CSS selects
      the border by it. The error message stays outside the piece, written by
      whoever uses it. It does not set aria-invalid, which is not valid on a
      button. disabled wins over it.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma disabled property. Turns the piece off: it leaves the Tab order,
      does not toggle, does not fire nph-change and stays at state/disabled-opacity.
      It is not the only sign: state the reason in text when there is one.
  size:
    type: string
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property tamanho: compact, default or large, 28, 36 or 44 px high,
      with or without text. Reflects because the internal CSS selects the height by
      it, and it is compared as written: a value with spaces around it is invalid.
      Icon only, the icon follows it: icon/size-sm, icon/size-md or icon/size-lg.
      Inside nph-toggle-group, the group writes it on every button. Any other value
      draws nothing and emits console.error in development.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The option name, already localized by the consuming application. It is the
      accessible name and stays on one line. Without text, the piece is the icon-only
      piece, which requires label.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Accessible name of the icon-only piece, mandatory in it: it becomes the
      aria-label of the native button. Without text and without label, the piece
      draws nothing and emits console.error in development. With text, it is not
      used.
  icon-start:
    type: string
    required: false
    default: auto
    reflects: false
    constraint: >-
      The icon before the text, in icon/size-sm. auto follows pressed: xmark when off
      and check when on, cross-faded by opacity. none turns the icon off. A name from
      the nph-icon core is one fixed icon, with no swap of name. The icon is solid
      when the piece is on or under the pointer, and light when it is off at rest and
      when it is disabled. The property is iconStart. Icon only uses this one, at the
      icon size of size. A value that is not auto, none or a core name draws nothing
      and emits console.error in development.
  icon-end:
    type: string
    required: false
    default: none
    reflects: false
    constraint: >-
      The icon after the text, with the same values, the same swap and the same
      styles as icon-start. The default is none: the piece shows one icon at most,
      and the start is the default side. With text, icon-start and icon-end both on
      draws nothing and emits console.error in development; to use the end, set
      icon-start to none. Use the end only when the icon tells what comes next, such
      as opening options. The property is iconEnd. Icon only ignores it. A value
      that is not auto, none or a core name draws nothing and emits console.error in
      development.
variants:
  pressed:
    axis: appearance
    choose_when: "false for an option that is off: no background and the quiet label. true for an option that is on: the checked background, the foreground label and the solid check icon."
    do_not_combine_with: []
  content:
    axis: appearance
    choose_when: "With text when the option name must be visible. Icon only when the icon is recognized without a caption; it takes label and shows one icon."
    do_not_combine_with:
      - "icon only with icon-start none: the piece would have nothing to show."
      - "icon only without label: the screen reader would announce only button."
      - "with text, icon-start and icon-end both on: the piece shows one icon at most."
  size:
    axis: size
    choose_when: "compact (28 px), default (36 px, the default) or large (44 px), with or without text. On touch screens, use large. Pieces side by side, and every button of an nph-toggle-group, take the same size."
    do_not_combine_with:
      - "compact: do not use as the main target on a touch screen."
      - "any size: do not mix sizes among pieces side by side."
states:
  unpressed:
    token: color/muted-foreground
    changes_for_user: "No background and no visible border; the label and the icon use color/muted-foreground, and the icon is light."
  pressed:
    token: "togglebutton/background-checked for the box; the label and the icon use color/foreground"
    changes_for_user: "The box takes the checked background, the label becomes color/foreground and the icon changes from xmark to check, solid. No semibold label and no stroke."
  hover:
    token: "togglebutton/background-hover when off and togglebutton/background-checked-hover when on; the label and the icon use color/foreground"
    changes_for_user: "The box takes the hover background of its pressed value, the label becomes color/foreground and the icon turns solid."
  focus:
    token: "border border/width in color/primary and halo focus/ring-width in focus/halo; when invalid, status/error and focus/halo-error"
    changes_for_user: "For keyboard users, a border and a halo outside the piece mark the focus, without changing the size."
  invalid:
    token: status/error
    changes_for_user: "The border becomes status/error, over the background of the state; the error message stays outside the piece."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece loses opacity, in the rest colors of its pressed value and with the light icon, leaves the Tab order and stops responding. A pressed piece keeps togglebutton/background-checked."
business_rules:
  - "The piece holds one boolean, pressed. Only a click, Enter or Space by the person toggles it and fires nph-change; setting pressed from code never fires the event."
  - "nph-change bubbles, crosses the shadow root, is not cancelable and carries detail.pressed with the new value."
  - "disabled wins over invalid: a disabled piece draws no error border. It is not an error case."
  - "The piece shows one icon at most. icon-start is auto and icon-end is none by default; with text, both on is invalid input."
  - "Icon only shows one icon, from icon-start; icon-end is ignored. The icon follows the size, and the piece hugs it, never square: 50 by 28, 54 by 36 or 58 by 44 px, with label as the accessible name."
  - "The icon is drawn light and solid, stacked: solid when the piece is on or under the pointer, light when it is off at rest and when it is disabled."
  - "The off-to-on change animates background, border and colors on motion/state-duration and motion/state-easing, with the icons cross-fading by opacity. Width, height and position never animate."
  - "Under reduced motion the change takes motion/hover-duration, and the color still changes."
domain_errors:
  - "invalid: the value of the option is not accepted by the screen. The piece shows the border; the message is written outside it."
tokens:
  box_background: [togglebutton/background-hover, togglebutton/background-checked, togglebutton/background-checked-hover]
  box_border: border/width
  box_radius: radius/control
  box_padding: space/inline-tight
  height: [control/height-compact, control/height-default, control/height-large]
  inner_radius: radius/inner
  inner_padding: space/control-padding
  icon_text_gap: space/inline-tight
  text: text/label-md
  text_color: [color/muted-foreground, color/foreground]
  icon: [icon/size-sm, icon/size-md, icon/size-lg]
  invalid: status/error
  disabled: state/disabled-opacity
  focus: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, color/primary, focus/halo, status/error, focus/halo-error]
  motion: [motion/state-duration, motion/state-easing]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-togglebutton for a button that holds on or off in a toolbar; to fire an action, use nph-button."
  - "Outside a toolbar, for a setting that turns on or off with an immediate effect, use nph-switch; in a form, when the choice goes with the submission, use nph-checkbox."
  - "Without text, fill in label; the piece shows one icon and has no other name."
  - "Leave icon-start on auto to get xmark when off and check when on; give a core icon name for one fixed icon, or none for no icon. Never turn on icon-start and icon-end together."
  - "Choose size by the context: compact, default or large; on touch screens, use large. Inside nph-toggle-group, set size on the group."
  - "Read the new value from detail.pressed of nph-change; do not read it from the host after a click."
  - "Separate neighboring pieces with space/inline."
  - "Do not mark the state only by the text color: pressed changes the background and the icon."
accessibility:
  semantics: "A native button inside the component, with type=button and aria-pressed following pressed. Never role switch or aria-checked, because the piece is a button that holds a state. aria-invalid is not valid on a button: invalid is shown by the border, and the error message stays outside the piece."
  accessible_name: "The visible text. Icon only, the label, mandatory, as the aria-label of the native button; the icons are aria-hidden."
  keyboard:
    - "Tab enters and leaves the piece."
    - "Enter toggles."
    - "Space toggles."
  focus: "Keyboard only: a border in color/primary and a halo outside, without changing the size; when invalid, status/error and focus/halo-error. The border is color/primary and not focus/border, which design.md says is the only one that guarantees 3:1 against the halo. Known limit, measured in the test: in dark mode, color/primary is below 3:1 against the page background in gerencial (2.71:1) and rh (2.88:1), and against the halo in every brand (1.76:1 to 2.94:1); in light mode it passes, and the lowest value is 3.33:1 against the halo, in educacao."
  contrast: "The label and the icon pass 6:1 on the background of each state, in every brand and in both schemes; the test measures every pair: color/muted-foreground on the page at rest, and color/foreground on togglebutton/background-hover, togglebutton/background-checked and togglebutton/background-checked-hover. The error border, status/error on color/background, measures 6.88:1 in light and 5.01:1 in dark. Known limit: the off label uses color/muted-foreground, and design.md marks that token as not for text needed to complete the task; the measured ratio passes 6:1 in both schemes."
  color_alternative: "The pressed state shows in the background, in the label color and in the icon, which swaps from xmark to check and turns solid, and aria-pressed exposes it. Known limit, accepted with the board: the checked background is 1.26:1 on the page in light and 1.54:1 in dark, and in dark without an icon the label barely changes. The invalid piece changes its border; the error message stays outside."
invalid_combinations:
  - "disabled with invalid — disabled wins, and the error border is not drawn."
  - "Icon only without label — the screen reader would announce only button."
  - "Icon only with icon-start none — there would be nothing to show."
  - "No text and no label — the piece has no accessible name and draws nothing."
  - "An icon-start or icon-end that is not auto, none or a core name — the piece draws nothing."
  - "With text, icon-start and icon-end both on — one icon at most; the piece draws nothing."
  - "A size that is not compact, default or large — the piece draws nothing."
relations:
  combines_with: [nph-icon, nph-button]
  parents: ["toolbar", "nph-toggle-group"]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the piece to fire an action."
  - "Marking the state only by changing the text color."
  - "Putting neighboring pieces together without space."
  - "Using the piece outside a toolbar for a setting that turns on or off, where nph-switch is the choice."
  - "Using the piece in a form, where nph-checkbox is the choice."
  - "Putting an error message inside the piece."
sources:
  design_md: "design.md, border/width, status/error, text/label-md, color/muted-foreground, color/foreground, color/primary, focus/*, state/disabled-opacity, control/height-compact, control/height-default, control/height-large, radius/control, radius/inner, space/inline-tight, space/control-padding, icon/size-sm, icon/size-md, icon/size-lg and motion/*; the togglebutton/* tokens in src/tokens/source/semantic.tokens.json"
  decision: "P73 — API and semantics of nph-togglebutton, 19-10-2026, and its amendment of 29-10-2026 (DSA-61): size, the new states and one icon at most"
  tests: "src/components/nph-togglebutton/nph-togglebutton.test.ts"
  usage_evidence: "nph-toggle-group (DSA-23, PR #92) is made of this piece and consumes nph-change"
  storybook: "src/components/nph-togglebutton/nph-togglebutton.stories.ts and nph-togglebutton.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-togglebutton board 1512:27498 and set 1512:719"
---

# nph-togglebutton

## Function

**The problem it solves:** gives the person a button that holds a boolean value, on or
off, with text or with an icon only, and shows the state in the piece itself. It does not
replace `nph-button`: `nph-button` fires an action, `nph-togglebutton` holds a state.

**When to use:**

- In a toolbar, when the option turns on or off with an immediate effect, among other
  buttons.
- With text, when the option name must be visible.
- Icon only, when the icon is recognized without a caption: give it an accessible name.
- One icon at most, at the start by default: without an icon, the background and the label
  color still show the state.

**When NOT to use:**

- **To fire an action** — use `nph-button`.
- **Outside a toolbar, in a setting that turns on or off with an immediate effect** — use
  `nph-switch`.
- **In a form, when the choice goes with the submission** — use `nph-checkbox`.
- **To mark the state by changing only the text color** — turn `pressed` on.

## Variants

**By appearance:** `pressed` (the Figma property `marcado`) and the content, with text or
icon only.

| Variant | Choose when |
|---|---|
| `pressed` false | The option is off: no background and the quiet label |
| `pressed` true | The option is on: the checked background, the foreground label and the solid `check` icon |
| With text | The option name must be visible |
| Icon only | The icon is recognized without a caption; the piece takes `label` and shows one icon |

**By size:** `size`, the Figma property `tamanho`, with or without text. On touch screens,
use `large`. Pieces side by side, and every button of an `nph-toggle-group`, take the same
size.

| `size` | Height | Icon only | When not to use |
|---|---|---|---|
| `compact` | `control/height-compact`, 28 px | `icon/size-sm` | As the main target on a touch screen |
| `default` (the default) | `control/height-default`, 36 px | `icon/size-md` | With a different size from the pieces beside it |
| `large` | `control/height-large`, 44 px | `icon/size-lg` | With a different size from the pieces beside it |

With text, the icon is `icon/size-sm` in the three sizes.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** icon only with `icon-start` `none`; icon only without `label`;
with text, `icon-start` and `icon-end` both on.

## States

| State | Token | What changes for the person |
|---|---|---|
| Off | No background; `color/muted-foreground` for the label and the icon | No background and no visible border, the label is quiet and the icon is `light` |
| Off, hover | `togglebutton/background-hover`; `color/foreground` for the label and the icon | The box takes the hover background, the label becomes `color/foreground` and the icon turns `solid` |
| Pressed | `togglebutton/background-checked`; `color/foreground` for the label and the icon | The box takes the checked background, and the icon changes from `xmark` to `check`, `solid`. No semibold label and no stroke |
| Pressed, hover | `togglebutton/background-checked-hover`; `color/foreground` for the label and the icon | The box takes the checked hover background; the icon stays `solid` |
| Focus | border `border/width` in `color/primary` and halo `focus/ring-width` in `focus/halo` | A border and a halo outside the piece mark the focus, without changing the size |
| Invalid | `status/error`, and on focus `status/error` with `focus/halo-error` | The border becomes `status/error`, over the background of the state; the message stays outside the piece |
| Disabled | `state/disabled-opacity` | The whole piece loses opacity, in the rest colors of its pressed value and with the `light` icon, leaves the Tab order and stops responding; a pressed piece keeps `togglebutton/background-checked` |

**Feedback and focus:** focus appears only for keyboard users and **is not removed**.
`disabled` **always wins** over `invalid`: a disabled piece draws no error border, and that
is not an error case. The off-to-on change animates the background, the border and the
colors on `motion/state-duration` and `motion/state-easing`, with the two icons cross-fading
by opacity; width, height and position never animate. Under reduced motion the change takes
`motion/hover-duration` and the color still changes: reducing motion does not remove the
feedback.

**Business rule the piece carries:**

- The piece holds one boolean, `pressed`. Only a click, Enter or Space by the person
  toggles it and fires `nph-change`; setting `pressed` from code never fires it.
- `nph-change` bubbles, crosses the shadow root, is not cancelable and carries
  `detail.pressed` with the new value.
- The piece shows one icon at most. `icon-start` is `auto` and `icon-end` is `none` by
  default; with text, both on is invalid input. The start is the default side; the end only
  when the icon tells what comes next, such as opening options.
- Icon only shows one icon, from `icon-start`; `icon-end` is ignored. The icon follows the
  size, and the piece hugs it, never square: 50 by 28, 54 by 36 or 58 by 44 px.
- The icon is drawn `light` and `solid`, stacked: `solid` when the piece is on or under the
  pointer, `light` when it is off at rest and when it is disabled.

**Domain error states:** `invalid`. The value of the option is not accepted by the screen.
The piece shows the border; the message is written outside it, by whoever uses the piece.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native button inside the component, with `type=button` and `aria-pressed` following `pressed`. Never `role` switch or `aria-checked`: the piece is a button that holds a state. `aria-invalid` is not valid on a button, so `invalid` is shown by the border and the message stays outside the piece |
| Accessible name | The visible text. Icon only, the `label`, mandatory, as the `aria-label` of the native button; the icons are `aria-hidden` |
| Keyboard | Tab enters and leaves; Enter and Space toggle |
| Focus | Keyboard only: a border in `color/primary` and a halo outside, without changing the size; when invalid, `status/error` and `focus/halo-error`. The border is `color/primary`, not `focus/border`, which `design.md` says is the only one that guarantees 3:1 against the halo. Known limit, measured in the test: in dark mode, `color/primary` is below 3:1 against the page background in gerencial (2.71:1) and rh (2.88:1), and against the halo in every brand (1.76:1 to 2.94:1); in light mode it passes, and the lowest value is 3.33:1 against the halo, in educacao |
| Contrast | The label and the icon pass 6:1 on the background of each state, in every brand and in both schemes; the test measures every pair: `color/muted-foreground` on the page at rest, and `color/foreground` on `togglebutton/background-hover`, `togglebutton/background-checked` and `togglebutton/background-checked-hover`. The error border, `status/error` on `color/background`, measures 6.88:1 in light and 5.01:1 in dark. Known limit: the off label uses `color/muted-foreground`, and `design.md` marks that token as not for text needed to complete the task; the measured ratio passes 6:1 in both schemes |
| Alternative to color | The pressed state shows in the background, in the label color and in the icon, which swaps from `xmark` to `check` and turns `solid`, and `aria-pressed` exposes it. Known limit, accepted with the board: the checked background is 1.26:1 on the page in light and 1.54:1 in dark, and in dark without an icon the label barely changes. The invalid piece changes its border |
| Touch target | The whole piece is the target: 28, 36 or 44 px high by size, with or without text. On touch screens, use `large` |
| Motion | Under reduced motion the change takes `motion/hover-duration`, and the color still changes |

## Relations

**Combines with:** `nph-icon`, the start and end icons, and `nph-button`, which fires an
action in the same toolbar. `nph-toggle-group` (DSA-23, PR #92) exists: it is made of
`nph-togglebutton` instances separated by `space/inline` and consumes `nph-change`. Two
pieces are **planned** and do not exist yet: `nph-switch` (a setting outside a toolbar) and
`nph-checkbox` (a choice in a form).

**What is the parent:** a toolbar. `nph-toggle-group` is the parent of a set of these
pieces.

**What is the child:** `nph-icon`, through `icon-start` or `icon-end`, in `icon/size-sm`
with text and in the icon size of `size` icon only. The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Box | No background at rest; `togglebutton/background-hover` on hover, `togglebutton/background-checked` when pressed and `togglebutton/background-checked-hover` when pressed and on hover. Border `border/width`, not seen until invalid; radius `radius/control`; padding on the four sides `space/inline-tight` |
| Height | `control/height-compact`, `control/height-default` or `control/height-large`, by `size` |
| Inner area | radius `radius/inner`, side padding `space/control-padding`, gap `space/inline-tight`; no background of its own |
| Text | `text/label-md`, in `color/muted-foreground` when off at rest and `color/foreground` when pressed or on hover |
| Icon | `icon/size-sm` with text; icon only, `icon/size-sm`, `icon/size-md` or `icon/size-lg` by `size` |
| Invalid | `status/error` |
| Disabled | `state/disabled-opacity` |
| Focus | `border/width`, `focus/border-radius-control`, `focus/ring-width`, `focus/radius-control-with-border`, `color/primary`, `focus/halo`, `status/error` and `focus/halo-error` |
| Motion | `motion/state-duration` and `motion/state-easing`; `motion/hover-duration` under reduced motion |

**Usage restrictions:** the component does not choose height, color, radius or
typography: everything comes from a token. The width has no token: the piece hugs its
content, and icon only is never square. In a part of the screen with another brand,
`data-nph-brand` and `data-nph-color-scheme` go on the same element (P67). The `use` of
some tokens in `design.md` is narrower than the accepted Figma (`space/inline-tight` on
four sides and the focus tokens): P73 records it for review.

**AI hints:**

- Use `nph-togglebutton` for a button that holds on or off in a toolbar; to fire an action,
  use `nph-button`.
- Outside a toolbar, for a setting that turns on or off with an immediate effect, use
  `nph-switch`; in a form, when the choice goes with the submission, use `nph-checkbox`.
- Without text, fill in `label`; the piece shows one icon and has no other name.
- Leave `icon-start` on `auto` to get `xmark` when off and `check` when on; give a core icon
  name for one fixed icon, or `none` for no icon. Never turn on `icon-start` and `icon-end`
  together.
- Choose `size` by the context: `compact`, `default` or `large`; on touch screens, use
  `large`. Inside `nph-toggle-group`, set `size` on the group.
- Read the new value from `detail.pressed` of `nph-change`; do not read it from the host
  after a click.
- Separate neighboring pieces with `space/inline`.
- Do not mark the state only by the text color: `pressed` changes the background and the
  icon.

## Examples

**Recommended case:** in a toolbar, a piece with the text "Show grid" and the default
icon at the start, off at first and pressed when the grid is on, next to `nph-button`
pieces that fire actions, all in the same size.

**Alternative case:** three icon-only pieces side by side, each with its `label`, one of
them pressed, separated by `space/inline`.

## Anti-patterns

- **Do not use the piece to fire an action** — use `nph-button`.
- **Do not mark the state only by the text color** — turn `pressed` on.
- **Do not put neighboring pieces together without space** — separate them with
  `space/inline`.
- **Do not use it outside a toolbar for a setting that turns on or off** — use `nph-switch`.
- **Do not use it in a form** — use `nph-checkbox`.
- **Do not put the error message inside the piece** — it stays outside, written by whoever
  uses the piece.
- **Invalid combinations:** `disabled` with `invalid`, where `disabled` wins; icon only
  without `label`; icon only with `icon-start` `none`; no text and no `label`; an icon that
  is not `auto`, `none` or a core name; with text, `icon-start` and `icon-end` both on; a
  `size` that is not `compact`, `default` or `large`.
- **Do not create without a decision:** a size beyond the three, a variant, a slot, an icon
  swap outside `auto`, `none` and the core names, or a form association.

## Sources and decisions

- **The repository `design.md`:** `border/width`, `status/error`, `text/label-md`,
  `color/muted-foreground`, `color/foreground`, `color/primary`, `focus/*`,
  `state/disabled-opacity`, `control/height-compact`, `control/height-default`,
  `control/height-large`, `radius/control`, `radius/inner`, `space/inline-tight`,
  `space/control-padding`, `icon/size-sm`, `icon/size-md`, `icon/size-lg` and `motion/*`.
  The `togglebutton/*` tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P73, of 19-10-2026, amended on 29-10-2026 (DSA-61):
  `size`, the new rest, hover and checked states and one icon at most. The board was
  accepted by Indiane on 07-10-2026; the answer to D6, on motion, of 19-10-2026; the board
  with the size and the new states, on 29-10-2026.
- **Tests:** `src/components/nph-togglebutton/nph-togglebutton.test.ts`.
- **Usage evidence:** `nph-toggle-group` (DSA-23, PR #92) is made of this piece and
  consumes `nph-change`.
- **Storybook:** `src/components/nph-togglebutton/nph-togglebutton.stories.ts` (Validation)
  and `nph-togglebutton.docs.stories.ts` (Docs).
- **Figma:** `nph-togglebutton` board (`1512:27498`) and set `1512:719` in
  `DS-IA-NEPHOS 5.0`.
