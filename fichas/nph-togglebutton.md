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
  - "Start and end icons are optional: the raised inner area with an outline still shows the state."
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
      and check when on, both rendered and cross-faded by opacity. none turns the
      icon off. A name from the nph-icon core is one fixed icon, with no swap. The
      property is iconStart. Icon only uses this one. A value that is not auto, none
      or a core name draws nothing and emits console.error in development.
  icon-end:
    type: string
    required: false
    default: auto
    reflects: false
    constraint: >-
      The icon after the text, with the same values and the same swap as icon-start.
      The property is iconEnd. Icon only ignores it. A value that is not auto, none
      or a core name draws nothing and emits console.error in development.
variants:
  pressed:
    axis: appearance
    choose_when: "false for an option that is off: the track and the inner area share the background. true for an option that is on: the inner area is raised, with a shadow and an outline."
    do_not_combine_with: []
  content:
    axis: appearance
    choose_when: "With text when the option name must be visible. Icon only when the icon is recognized without a caption; it takes label and shows one icon."
    do_not_combine_with:
      - "icon only with icon-start none: the piece would have nothing to show."
      - "icon only without label: the screen reader would announce only button."
states:
  unpressed:
    token: color/muted
    changes_for_user: "The track and the inner area share the background; the label and the icon use color/muted-foreground."
  pressed:
    token: "color/background for the inner area, elevation/subtle for the shadow and color/primary-border for the outline; the label and the icon use color/foreground"
    changes_for_user: "The inner area rises, with a shadow and an outline, and the icon changes from xmark to check."
  hover:
    token: color/foreground
    changes_for_user: "In the off piece, the label and the icon go from color/muted-foreground to color/foreground."
  focus:
    token: "border border/width in color/primary and halo focus/ring-width in focus/halo; when invalid, status/error and focus/halo-error"
    changes_for_user: "For keyboard users, a border and a halo outside the piece mark the focus, without changing the size."
  invalid:
    token: status/error
    changes_for_user: "The track border becomes status/error; the error message stays outside the piece."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece loses opacity, leaves the Tab order and stops responding."
business_rules:
  - "The piece holds one boolean, pressed. Only a click, Enter or Space by the person toggles it and fires nph-change; setting pressed from code never fires the event."
  - "nph-change bubbles, crosses the shadow root, is not cancelable and carries detail.pressed with the new value."
  - "disabled wins over invalid: a disabled piece draws no error border. It is not an error case."
  - "Icon only shows one icon, from icon-start; icon-end is ignored. The piece is 50 by 36 px, never square, with label as the accessible name."
  - "The off-to-on change animates background, border and colors on motion/state-duration and motion/state-easing, with the icons cross-fading by opacity. Width, height and position never animate."
  - "Under reduced motion the change takes motion/hover-duration, and the color still changes."
domain_errors:
  - "invalid: the value of the option is not accepted by the screen. The piece shows the border; the message is written outside it."
tokens:
  track_background: color/muted
  track_border: [border/width, color/muted]
  track_radius: radius/control
  track_padding: space/inline-tight
  height: control/height-default
  inner_radius: radius/inner
  inner_padding: space/control-padding
  icon_text_gap: space/inline-tight
  inner_pressed: [color/background, elevation/subtle, color/primary-border]
  text: text/label-md
  text_color: [color/muted-foreground, color/foreground]
  icon: icon/size-sm
  invalid: status/error
  disabled: state/disabled-opacity
  focus: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, color/primary, focus/halo, status/error, focus/halo-error]
  motion: [motion/state-duration, motion/state-easing]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-togglebutton for a button that holds on or off in a toolbar; to fire an action, use nph-button."
  - "Outside a toolbar, for a setting that turns on or off with an immediate effect, use nph-switch; in a form, when the choice goes with the submission, use nph-checkbox."
  - "Without text, fill in label; the piece shows one icon and has no other name."
  - "Leave icon-start and icon-end on auto to get xmark when off and check when on; give a core icon name for one fixed icon, or none for no icon."
  - "Read the new value from detail.pressed of nph-change; do not read it from the host after a click."
  - "Separate neighboring pieces with space/inline."
  - "Do not mark the state only by the text color: pressed draws the raised inner area."
accessibility:
  semantics: "A native button inside the component, with type=button and aria-pressed following pressed. Never role switch or aria-checked, because the piece is a button that holds a state. aria-invalid is not valid on a button: invalid is shown by the border, and the error message stays outside the piece."
  accessible_name: "The visible text. Icon only, the label, mandatory, as the aria-label of the native button; the icons are aria-hidden."
  keyboard:
    - "Tab enters and leaves the piece."
    - "Enter toggles."
    - "Space toggles."
  focus: "Keyboard only: a border in color/primary and a halo outside, without changing the size; when invalid, status/error and focus/halo-error. The border is color/primary and not focus/border, which design.md says is the only one that guarantees 3:1 against the halo. Known limit, measured in the test: in dark mode, color/primary is below 3:1 against the page background in gerencial (2.71:1) and rh (2.88:1), and against the halo in every brand (1.76:1 to 2.94:1); in light mode it passes, and the lowest value is 3.33:1 against the halo, in educacao."
  contrast: "The rule is 4.5:1 for the label and the icon on their own background in both schemes, and 3:1 for the outline of the pressed inner area on the track; the test measures both. The off label, color/muted-foreground on color/muted, measures 5.76:1 in light and 6.61:1 in dark. The pressed outline, color/primary-border on the track, passes 3:1 in every brand and in both schemes: the lowest value is 3.31:1, in dark gerencial, and 4.27:1 in light educacao. The error border, status/error on color/background, measures 6.88:1 in light and 5.01:1 in dark. Known limit: the off label uses color/muted-foreground, and design.md marks that token as not for text needed to complete the task; the measured ratio passes 4.5:1 in both schemes."
  color_alternative: "The pressed state shows in the raised inner area with an outline and in the icon, not only in the text color. The invalid piece changes its border; the error message stays outside."
invalid_combinations:
  - "disabled with invalid — disabled wins, and the error border is not drawn."
  - "Icon only without label — the screen reader would announce only button."
  - "Icon only with icon-start none — there would be nothing to show."
  - "No text and no label — the piece has no accessible name and draws nothing."
  - "An icon-start or icon-end that is not auto, none or a core name — the piece draws nothing."
relations:
  combines_with: [nph-icon, nph-button]
  parents: ["toolbar", "nph-toggle-group (planned, DSA-23)"]
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
  design_md: "design.md, color/muted, border/width, status/error, color/background, elevation/subtle, color/primary-border, text/label-md, color/muted-foreground, color/foreground, color/primary, focus/*, state/disabled-opacity, control/height-default, radius/control, radius/inner, space/inline-tight, space/control-padding, icon/size-sm and motion/*"
  decision: "P73 — API and semantics of nph-togglebutton, 19-10-2026"
  tests: "src/components/nph-togglebutton/nph-togglebutton.test.ts"
  usage_evidence: "none in code yet; nph-toggle-group (DSA-23, planned) will be made of this piece and consume nph-change"
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
- Start and end icons are optional: the raised inner area with an outline still shows the
  state.

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
| `pressed` false | The option is off: the track and the inner area share the background |
| `pressed` true | The option is on: the inner area is raised, with a shadow and an outline |
| With text | The option name must be visible |
| Icon only | The icon is recognized without a caption; the piece takes `label` and shows one icon |

**By size:** `not_applicable`. Size is not a property: the height comes from
`control/height-default`, 36 px, with or without text.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** icon only with `icon-start` `none`; icon only without `label`.

## States

| State | Token | What changes for the person |
|---|---|---|
| Off | `color/muted` for the track and the inner area; `color/muted-foreground` for the label and the icon | The inner area is flat and the label is quiet |
| Pressed | `color/background`, `elevation/subtle` and `color/primary-border` for the inner area; `color/foreground` for the label and the icon | The inner area rises, with a shadow and an outline, and the icon changes from `xmark` to `check` |
| Hover | `color/foreground` | In the off piece, the label and the icon go from `color/muted-foreground` to `color/foreground` |
| Focus | border `border/width` in `color/primary` and halo `focus/ring-width` in `focus/halo` | A border and a halo outside the piece mark the focus, without changing the size |
| Invalid | `status/error`, and on focus `status/error` with `focus/halo-error` | The track border becomes `status/error`; the message stays outside the piece |
| Disabled | `state/disabled-opacity` | The whole piece loses opacity, leaves the Tab order and stops responding |

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
- Icon only shows one icon, from `icon-start`; `icon-end` is ignored. The piece is
  50 by 36 px, never square.

**Domain error states:** `invalid`. The value of the option is not accepted by the screen.
The piece shows the border; the message is written outside it, by whoever uses the piece.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native button inside the component, with `type=button` and `aria-pressed` following `pressed`. Never `role` switch or `aria-checked`: the piece is a button that holds a state. `aria-invalid` is not valid on a button, so `invalid` is shown by the border and the message stays outside the piece |
| Accessible name | The visible text. Icon only, the `label`, mandatory, as the `aria-label` of the native button; the icons are `aria-hidden` |
| Keyboard | Tab enters and leaves; Enter and Space toggle |
| Focus | Keyboard only: a border in `color/primary` and a halo outside, without changing the size; when invalid, `status/error` and `focus/halo-error`. The border is `color/primary`, not `focus/border`, which `design.md` says is the only one that guarantees 3:1 against the halo. Known limit, measured in the test: in dark mode, `color/primary` is below 3:1 against the page background in gerencial (2.71:1) and rh (2.88:1), and against the halo in every brand (1.76:1 to 2.94:1); in light mode it passes, and the lowest value is 3.33:1 against the halo, in educacao |
| Contrast | 4.5:1 for the label and the icon on their own background in both schemes, and 3:1 for the outline of the pressed inner area on the track; the test measures both. The off label, `color/muted-foreground` on `color/muted`, measures 5.76:1 in light and 6.61:1 in dark. The pressed outline, `color/primary-border` on the track, passes 3:1 in every brand and in both schemes: the lowest value is 3.31:1, in dark gerencial, and 4.27:1 in light educacao. The error border, `status/error` on `color/background`, measures 6.88:1 in light and 5.01:1 in dark. Known limit: the off label uses `color/muted-foreground`, and `design.md` marks that token as not for text needed to complete the task; the measured ratio passes 4.5:1 in both schemes |
| Alternative to color | The pressed state shows in the raised inner area with an outline and in the icon, not only in the text color. The invalid piece changes its border |
| Touch target | The whole piece is the target: 36 px high, with or without text |
| Motion | Under reduced motion the change takes `motion/hover-duration`, and the color still changes |

## Relations

**Combines with:** `nph-icon`, the start and end icons, and `nph-button`, which fires an
action in the same toolbar. Three pieces are **planned** and do not exist yet: `nph-switch`
(a setting outside a toolbar), `nph-checkbox` (a choice in a form) and `nph-toggle-group`
(DSA-23), which will be made of `nph-togglebutton` instances separated by `space/inline`
and will consume `nph-change`.

**What is the parent:** a toolbar. The planned `nph-toggle-group` will be the parent of a
set of these pieces.

**What is the child:** `nph-icon`, through `icon-start` and `icon-end`, in `icon/size-sm`.
The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Track | `color/muted`, border `border/width` in `color/muted`, radius `radius/control`, padding on the four sides `space/inline-tight`, height `control/height-default` |
| Inner area | radius `radius/inner`, side padding `space/control-padding`, gap `space/inline-tight` |
| Pressed | `color/background`, `elevation/subtle`, outline `color/primary-border` at `border/width` |
| Text | `text/label-md`, in `color/muted-foreground` when off and `color/foreground` when pressed or on hover |
| Icon | `icon/size-sm` |
| Invalid | `status/error` |
| Disabled | `state/disabled-opacity` |
| Focus | `border/width`, `focus/border-radius-control`, `focus/ring-width`, `focus/radius-control-with-border`, `color/primary`, `focus/halo`, `status/error` and `focus/halo-error` |
| Motion | `motion/state-duration` and `motion/state-easing`; `motion/hover-duration` under reduced motion |

**Usage restrictions:** the component does not choose height, color, radius or
typography: everything comes from a token. The width has no token: the piece hugs its
content, and icon only is 50 by 36 px. In a part of the screen with another brand,
`data-nph-brand` and `data-nph-color-scheme` go on the same element (P67). The `use` of
some tokens in `design.md` is narrower than the accepted Figma (`color/muted`,
`color/background`, `space/inline-tight` on four sides and the focus tokens): P73 records it
for review.

**AI hints:**

- Use `nph-togglebutton` for a button that holds on or off in a toolbar; to fire an action,
  use `nph-button`.
- Outside a toolbar, for a setting that turns on or off with an immediate effect, use
  `nph-switch`; in a form, when the choice goes with the submission, use `nph-checkbox`.
- Without text, fill in `label`; the piece shows one icon and has no other name.
- Leave `icon-start` and `icon-end` on `auto` to get `xmark` when off and `check` when on;
  give a core icon name for one fixed icon, or `none` for no icon.
- Read the new value from `detail.pressed` of `nph-change`; do not read it from the host
  after a click.
- Separate neighboring pieces with `space/inline`.
- Do not mark the state only by the text color: `pressed` draws the raised inner area.

## Examples

**Recommended case:** in a toolbar, a piece with the text "Show grid" and the default
icons, off at first and pressed when the grid is on, next to `nph-button` pieces that fire
actions.

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
  is not `auto`, `none` or a core name.
- **Do not create without a decision:** a size, a variant, a slot, an icon swap outside
  `auto`, `none` and the core names, or a form association.

## Sources and decisions

- **The repository `design.md`:** `color/muted`, `border/width`, `status/error`,
  `color/background`, `elevation/subtle`, `color/primary-border`, `text/label-md`,
  `color/muted-foreground`, `color/foreground`, `color/primary`, `focus/*`,
  `state/disabled-opacity`, `control/height-default`, `radius/control`, `radius/inner`,
  `space/inline-tight`, `space/control-padding`, `icon/size-sm` and `motion/*`.
- **The decision that originated it:** P73, of 19-10-2026. The board was accepted by
  Indiane on 07-10-2026; the answer to D6, on motion, of 19-10-2026.
- **Tests:** `src/components/nph-togglebutton/nph-togglebutton.test.ts`.
- **Usage evidence:** none in code yet. `nph-toggle-group` (DSA-23, planned) will be made
  of this piece.
- **Storybook:** `src/components/nph-togglebutton/nph-togglebutton.stories.ts` (Validation)
  and `nph-togglebutton.docs.stories.ts` (Docs).
- **Figma:** `nph-togglebutton` board (`1512:27498`) and set `1512:719` in
  `DS-IA-NEPHOS 5.0`.
