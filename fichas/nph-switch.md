---
piece: nph-switch
level: component
status: active
solves: >-
  Gives the person a switch that turns a setting on or off, with an immediate effect,
  and shows the state by the position of the knob, with the name of the setting next
  to it.
use_when:
  - "For a setting that turns on or off, with an immediate effect, outside a toolbar."
  - "Several settings stack, one nph-switch per line: there is no group component."
  - "Without text only when the name is already in the context, such as a table cell, always with label."
do_not_use_when:
  - "In a form, when the choice only counts on submission: use nph-checkbox."
  - "In a toolbar, among other buttons: use nph-togglebutton."
  - "To paint the track or the knob by hand: use checked, invalid and disabled."
  - "To hide the label by deleting its text: leave text empty and give label."
api:
  checked:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma property marcado. Reflects because the internal CSS selects the
      state by it; the piece is not associated with a form. A click, Enter or Space
      by the person toggles it and fires input and then change; setting it from code
      fires nothing. The name and the mapping from marcado are a technical proposal
      of P79.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The label, already localized by the consuming application, after the track.
      It is the accessible name and wraps to the available width. Without text (the
      Figma boolean that shows the label, off), the piece is only the track and requires label.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Accessible name of the piece without text, mandatory in it: it becomes the
      aria-label of the native button. Without text and without label, the piece
      draws nothing and emits console.error in development. With text, it is not
      used.
  invalid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma error state, with or without focus. The track outline becomes status/error,
      on or off, and on focus the halo becomes focus/halo-error. It sets aria-invalid
      on the native button. The error sentence stays outside the piece, written by
      whoever uses it. disabled wins over it.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma disabled state. Turns the piece off: it leaves the Tab order, does
      not toggle, fires nothing and stays at state/disabled-opacity. It is not the
      only sign: state the reason in text when there is one.
variants:
  checked:
    axis: appearance
    choose_when: "false for a setting that is off: the knob on the left, the track in color/input. true for a setting that is on: the knob on the right, the track in color/primary with an outline."
    do_not_combine_with: []
  label:
    axis: appearance
    choose_when: "With text, the default, when the name of the setting must be visible. Only the track when the name is already in the context, such as a table cell; it takes label."
    do_not_combine_with:
      - "only the track without label: the screen reader would announce only switch."
states:
  unchecked:
    token: "color/input for the track, with no outline; color/background for the knob"
    changes_for_user: "The knob is on the left and the track is quiet."
  checked:
    token: "color/primary for the track, with an outline in color/primary-border; color/primary-foreground for the knob"
    changes_for_user: "The knob slides to the right and the track takes the brand color."
  hover:
    token: "color/input-hover when off and color/primary-hover when on"
    changes_for_user: "Over the whole piece, the fill goes one step up; the outline stays."
  focus:
    token: "outline border/width in focus/border and halo focus/ring-width in focus/halo, both radius/full; when invalid, status/error and focus/halo-error"
    changes_for_user: "For keyboard users, the track outline and a halo outside the track mark the focus, without changing the size."
  invalid:
    token: status/error
    changes_for_user: "The track outline becomes status/error, on or off; the error sentence stays outside the piece."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece loses opacity, leaves the Tab order and stops responding."
business_rules:
  - "The piece holds one boolean, checked. Only a click, Enter or Space by the person toggles it and fires input and then change; setting checked from code fires nothing."
  - "input bubbles and crosses shadow roots; change bubbles and does not, as on a native control. The new value is read from event.target.checked. There is no nph event."
  - "disabled wins over invalid: a disabled piece draws no error outline and has no aria-invalid. It is not an error case."
  - "The knob slides by transform, never by layout position, and the track fill and outline change on motion/state-duration and motion/state-easing."
  - "Under reduced motion the knob does not slide: it changes side by opacity on motion/hover-duration, and the color still changes."
  - "Inside nph-field, the piece is one option of a group: nphFieldRole is option, and the field writes invalid and disabled on it."
domain_errors:
  - "invalid: the value of the setting is not accepted by the screen. The piece shows the outline; the sentence is written outside it."
tokens:
  track_width: switch/track-width
  track_height: icon/size-lg
  track_radius: radius/full
  track_off: color/input
  track_on: color/primary
  track_hover: [color/input-hover, color/primary-hover]
  track_outline: [border/width, color/primary-border]
  knob: [icon/size-sm, radius/full, space/inline-tight]
  knob_color: [color/background, color/primary-foreground]
  label_gap: space/inline
  text: text/label-md
  text_color: color/foreground
  invalid: status/error
  disabled: state/disabled-opacity
  focus: [border/width, focus/border, focus/ring-width, focus/halo, radius/full, status/error, focus/halo-error]
  motion: [motion/state-duration, motion/state-easing]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-switch for a setting that turns on or off with an immediate effect, outside a toolbar; in a toolbar, use nph-togglebutton; in a form, use nph-checkbox."
  - "Stack several settings, one nph-switch per line; there is no group component."
  - "Without text, fill in label; the piece is only the track and has no other name."
  - "Read the new value from event.target.checked in the change event; there is no nph event."
  - "Write the error sentence outside the piece; invalid only changes the track outline."
  - "Do not paint the track or the knob: checked, invalid and disabled draw every state."
accessibility:
  semantics: "A native button inside the component, with type=button, role=switch and aria-checked following checked; the track is aria-hidden. invalid sets aria-invalid, which role=switch supports. The piece is not associated with a form."
  accessible_name: "The label text. Without text, the label, mandatory, as the aria-label of the native button."
  keyboard:
    - "Tab enters and leaves the piece."
    - "Space toggles."
    - "Enter toggles."
  focus: "Keyboard only: the track outline turns focus/border and a halo in focus/halo shows outside the track, both radius/full, without changing the size; when invalid, status/error and focus/halo-error. The label gets no ring. Known limit, recorded in design.md and measured in the test: focus/border against focus/halo is 2.92:1 in the default brand in light mode; every other brand and scheme passes 3:1."
  contrast: "The rule is 3:1 for the track edge on the page background and for the knob on its track, in every brand and in both schemes; the test measures both. color/input on color/background measures 3.23:1 in light and 6.58:1 in dark. color/primary-border on color/background measures at least 4.96:1 in light and 4.91:1 in dark. color/background on color/input measures 3.23:1 in light and 6.58:1 in dark, and color/primary-foreground on color/primary at least 4.96:1. The error outline, status/error on color/background, measures 6.88:1 in light and 5.01:1 in dark. The label, color/foreground on color/background, passes 4.5:1."
  color_alternative: "On and off show in the knob position, not only in the track color. The invalid piece changes its outline; the error sentence stays outside."
invalid_combinations:
  - "disabled with invalid — disabled wins, and the error outline is not drawn."
  - "Only the track without label — the screen reader would announce only switch."
  - "No text and no label — the piece has no accessible name and draws nothing."
relations:
  combines_with: [nph-field]
  parents: ["settings list", "table cell", "nph-field"]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the piece in a form whose choice only counts on submission."
  - "Using the piece among toolbar buttons."
  - "Painting the track or the knob by hand."
  - "Deleting the label text to hide it without giving label."
  - "Putting the error sentence inside the piece."
  - "Grouping several pieces in a component of its own: they stack, one per line."
sources:
  design_md: "design.md, switch/track-width, icon/size-lg, icon/size-sm, radius/full, color/input, color/input-hover, color/primary, color/primary-hover, color/primary-border, color/primary-foreground, color/background, color/foreground, border/width, status/error, space/inline, space/inline-tight, text/label-md, focus/*, state/disabled-opacity and motion/*"
  decision: "P79 — API and semantics of nph-switch, 22-10-2026"
  tests: "src/components/nph-switch/nph-switch.test.ts"
  usage_evidence: "no piece consumes it yet; nph-dropdown-menu (DSA-45) will use it without a label"
  storybook: "src/components/nph-switch/nph-switch.stories.ts and nph-switch.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-switch frame 1549:2 and set 1548:56"
---

# nph-switch

## Function

**The problem it solves:** gives the person a switch that turns a setting on or off, with an
immediate effect, and shows the state by the position of the knob, with the name of the
setting next to it. It does not replace `nph-togglebutton`, which holds a state in a toolbar,
nor `nph-checkbox`, whose choice goes with a form submission.

**When to use:**

- For a setting that turns on or off, with an immediate effect, outside a toolbar.
- Several settings stack, one `nph-switch` per line: there is no group component.
- Without text only when the name is already in the context, such as a table cell, always
  with `label`.

**When NOT to use:**

- **In a form, when the choice only counts on submission** — use `nph-checkbox`.
- **In a toolbar, among other buttons** — use `nph-togglebutton`.
- **To paint the track or the knob by hand** — use `checked`, `invalid` and `disabled`.
- **To hide the label by deleting its text** — leave `text` empty and give `label`.

## Variants

**By appearance:** `checked` (the Figma property `marcado`) and the label, with text or only
the track (the Figma property `mostrar rótulo`).

| Variant | Choose when |
|---|---|
| `checked` false | The setting is off: the knob on the left, the track in `color/input` |
| `checked` true | The setting is on: the knob on the right, the track in `color/primary` with an outline |
| With text | The default, when the name of the setting must be visible |
| Only the track | The name is already in the context, such as a table cell; the piece takes `label` |

**By size:** `not_applicable`. There is no size: the track is always `switch/track-width` by
`icon/size-lg`, 40 by 24 px.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** only the track without `label`.

## States

| State | Token | What changes for the person |
|---|---|---|
| Off | `color/input` for the track, with no outline; `color/background` for the knob | The knob is on the left and the track is quiet |
| On | `color/primary` for the track, with an outline in `color/primary-border` drawn inside; `color/primary-foreground` for the knob | The knob slides to the right and the track takes the brand color |
| Hover | `color/input-hover` when off and `color/primary-hover` when on | Over the whole piece, the fill goes one step up; the outline stays |
| Focus | outline `border/width` in `focus/border` and halo `focus/ring-width` in `focus/halo`, both `radius/full` | The track outline and a halo outside the track mark the focus, without changing the size |
| Invalid | `status/error`, and on focus `status/error` with `focus/halo-error` | The track outline becomes `status/error`, on or off; the sentence stays outside the piece |
| Disabled | `state/disabled-opacity` | The whole piece loses opacity, leaves the Tab order and stops responding |

**Feedback and focus:** focus appears only for keyboard users, on the track, and **is not
removed**. `disabled` **always wins** over `invalid`: a disabled piece draws no error outline,
and that is not an error case. The knob slides by transform and the track fill and outline
change on `motion/state-duration` and `motion/state-easing`, both ways; width, height and
layout position never animate. Under reduced motion the knob does not slide: it changes side
by opacity on `motion/hover-duration`, and the color still changes: reducing motion does not
remove the feedback.

**Business rule the piece carries:**

- The piece holds one boolean, `checked`. Only a click, Enter or Space by the person toggles
  it and fires `input` and then `change`; setting `checked` from code fires nothing.
- `input` bubbles and crosses shadow roots; `change` bubbles and does not, as on a native
  control. The new value is read from `event.target.checked`. There is no `nph-*` event.
- Inside `nph-field`, the piece is one option of a group: `nphFieldRole` is `option`, and the
  field writes `invalid` and `disabled` on it.

**Domain error states:** `invalid`. The value of the setting is not accepted by the screen.
The piece shows the outline; the sentence is written outside it, by whoever uses the piece.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native button inside the component, with `type=button`, `role=switch` and `aria-checked` following `checked`; the track is `aria-hidden`. `invalid` sets `aria-invalid`, which `role=switch` supports. The piece is not associated with a form |
| Accessible name | The label text. Without text, the `label`, mandatory, as the `aria-label` of the native button |
| Keyboard | Tab enters and leaves; Space and Enter toggle |
| Focus | Keyboard only: the track outline turns `focus/border` and a halo in `focus/halo` shows outside the track, both `radius/full`, without changing the size; when invalid, `status/error` and `focus/halo-error`. Known limit, recorded in `design.md` and measured in the test: `focus/border` against `focus/halo` is 2.92:1 in the default brand in light mode; every other brand and scheme passes 3:1 |
| Contrast | 3:1 for the track edge on the page background and for the knob on its track, in every brand and in both schemes; the test measures both. `color/input` on `color/background` measures 3.23:1 in light and 6.58:1 in dark; `color/primary-border` at least 4.96:1 in light and 4.91:1 in dark. `color/background` on `color/input` measures 3.23:1 in light and 6.58:1 in dark, and `color/primary-foreground` on `color/primary` at least 4.96:1. The error outline, `status/error` on `color/background`, measures 6.88:1 in light and 5.01:1 in dark |
| Alternative to color | On and off show in the knob position, not only in the track color. The invalid piece changes its outline |
| Touch target | The whole track, 40 by 24 px; with a label, the whole piece |
| Motion | Under reduced motion the knob changes side by opacity on `motion/hover-duration`, and the color still changes |
| Known limits | A forced-colors mode and a right-to-left page are not handled yet. The error sentence outside the piece cannot be tied to it by `aria-describedby` across the shadow root; inside `nph-field`, the field describes the group |

## Relations

**Combines with:** `nph-field`, which names and describes a group of these pieces. In a
toolbar, among other buttons, the piece is `nph-togglebutton`; in a form whose choice only
counts on submission, it is `nph-checkbox`.

**What is the parent:** a list of settings, a table cell or `nph-field`.

**What is the child:** none. The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Track | `switch/track-width` by `icon/size-lg`, `radius/full`; `color/input` off and `color/primary` on |
| Track hover | `color/input-hover` and `color/primary-hover` |
| Track outline | `border/width` in `color/primary-border` when on, drawn inside |
| Knob | `icon/size-sm`, `radius/full`, `space/inline-tight` from the track edge; `color/background` off and `color/primary-foreground` on |
| Label | `text/label-md` in `color/foreground`, `space/inline` from the track |
| Invalid | `status/error` |
| Disabled | `state/disabled-opacity` |
| Focus | `border/width`, `focus/border`, `focus/ring-width`, `focus/halo`, `radius/full`, `status/error` and `focus/halo-error` |
| Motion | `motion/state-duration` and `motion/state-easing`; `motion/hover-duration` under reduced motion |

**Usage restrictions:** the component does not choose width, height, color, radius or
typography: everything comes from a token. The knob travel is the track width minus the knob
and the two gaps. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67). The `use` of some tokens in `design.md`
is narrower than the accepted Figma (`color/input` as the track fill and `icon/size-lg` as the
track height): P79 records it for review.

**AI hints:**

- Use `nph-switch` for a setting that turns on or off with an immediate effect, outside a
  toolbar; in a toolbar, use `nph-togglebutton`; in a form, use `nph-checkbox`.
- Stack several settings, one `nph-switch` per line; there is no group component.
- Without text, fill in `label`; the piece is only the track and has no other name.
- Read the new value from `event.target.checked` in the `change` event; there is no `nph-*`
  event.
- Write the error sentence outside the piece; `invalid` only changes the track outline.
- Do not paint the track or the knob: `checked`, `invalid` and `disabled` draw every state.

## Examples

**Recommended case:** a list of preferences — "Email notifications" on, "Push notifications"
off and "Weekly summary" on — one `nph-switch` per line, each with its label.

**Alternative case:** a table with a column of settings, where each cell holds only the
track, with `label` naming the row.

## Anti-patterns

- **Do not use it in a form whose choice only counts on submission** — use `nph-checkbox`.
- **Do not use it among toolbar buttons** — use `nph-togglebutton`.
- **Do not paint the track or the knob by hand** — use `checked`, `invalid` and `disabled`.
- **Do not delete the label text to hide it without a name** — leave `text` empty and give
  `label`.
- **Do not put the error sentence inside the piece** — it stays outside, written by whoever
  uses the piece.
- **Do not group several pieces in a component of their own** — they stack, one per line.
- **Invalid combinations:** `disabled` with `invalid`, where `disabled` wins; only the track
  without `label`; no text and no `label`.
- **Do not create without a decision:** a size, a variant, a slot, a group or a form
  association.

## Sources and decisions

- **The repository `design.md`:** `switch/track-width`, `icon/size-lg`, `icon/size-sm`,
  `radius/full`, `color/input`, `color/input-hover`, `color/primary`, `color/primary-hover`,
  `color/primary-border`, `color/primary-foreground`, `color/background`, `color/foreground`,
  `border/width`, `status/error`, `space/inline`, `space/inline-tight`, `text/label-md`,
  `focus/*`, `state/disabled-opacity` and `motion/*`.
- **The decision that originated it:** P79, of 22-10-2026. The frame was accepted by Indiane
  on 08-10-2026; the answers D1 to D4, of 19-10-2026.
- **Tests:** `src/components/nph-switch/nph-switch.test.ts`.
- **Usage evidence:** no piece consumes it yet; `nph-dropdown-menu` (DSA-45) will use it
  without a label.
- **Storybook:** `src/components/nph-switch/nph-switch.stories.ts` (Validation) and
  `nph-switch.docs.stories.ts` (Docs).
- **Figma:** `nph-switch` frame (`1549:2`) and set `1548:56` in `DS-IA-NEPHOS 5.0`.
