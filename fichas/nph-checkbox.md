---
piece: nph-checkbox
level: component
status: active
solves: >-
  Gives the person a box with its own text, to check independent options or to turn one
  option on or off, and sends the choice with the form.
use_when:
  - "When the person can check more than one option, each independent."
  - "For a single option, which the person turns on or off."
  - "Indeterminate only on the item that summarizes a group checked in part: it is not an answer from the person."
  - "The box alone only when the name is already in the context, such as a table cell, always with label."
do_not_use_when:
  - "When the options exclude each other: use nph-radio."
  - "Around it, an nph-field only to give it a name: the box already brings its own text."
  - "To mix checkbox and radio in the same group."
  - "To put a link in the text, such as the terms of use: the link stays outside the piece."
  - "To paint the box or the mark by hand: the piece takes its colors from tokens."
api:
  checked:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      The current state, the Figma marcado true. It does not reflect: the checked
      attribute is the default state, the one a form reset goes back to. Once the person
      toggles the piece or code sets checked, the piece is dirty and the attribute no
      longer moves the current state, as on the native checkbox. Setting it from code
      fires no event.
  indeterminate:
    type: boolean
    required: false
    default: false
    reflects: false
    constraint: >-
      A group checked only in part, the Figma marcado indeterminado. The box shows the
      minus mark whatever checked is. A click of the person clears it and toggles checked.
      It does not change what the form submits. Setting it from code fires no event.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The plain text next to the box, already localized by the consuming application: the
      name of the control. No link and no rich content inside it. It wraps, with the box at
      the top. Without text, the piece is only the box, at 24 by 24, and requires label.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the box alone; it becomes the aria-label of the inner
      checkbox. Without text and without label, the piece draws nothing and emits
      console.error in development. With text, it is not used.
  invalid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The error state of the Figma. The box border becomes status/error, checked or not, and the
      inner checkbox takes aria-invalid. Reflects because the internal CSS selects the
      border by it. The error sentence stays outside the piece. disabled wins over it.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma state disabled. The whole piece at state/disabled-opacity, text included;
      it leaves the Tab order, does not toggle, fires nothing and is not submitted. It is
      the disabled attribute of the host, set at once, so the host matches the disabled
      pseudo-class. A disabled fieldset has the same effect.
  name:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The name of the entry in the form data. It is the name attribute of the host: the
      form reads the attribute, so the property writes it.
  value:
    type: string
    required: false
    default: "on"
    reflects: true
    constraint: >-
      What a checked piece submits under name. It is the value attribute of the host, on
      when the attribute is absent, as on the native checkbox.
variants:
  checked:
    axis: appearance
    choose_when: "Unchecked for an option that is off; checked for an option that is on; indeterminate only on the item that summarizes a group checked in part."
    do_not_combine_with: []
  content:
    axis: appearance
    choose_when: "With text in every case where the name must be visible. The box alone only when the name is already in the context, such as a table cell; it takes label."
    do_not_combine_with:
      - "the box alone without label: the screen reader would announce only checkbox."
states:
  unchecked:
    token: "color/background for the fill and color/input for the border"
    changes_for_user: "An empty box, with the text next to it."
  checked:
    token: "color/primary for the fill and color/primary-foreground for the check mark; the border stays color/input"
    changes_for_user: "The box is filled and shows the check mark."
  indeterminate:
    token: "color/primary for the fill and color/primary-foreground for the minus mark"
    changes_for_user: "The box is filled and shows the minus mark: the group is checked only in part."
  hover:
    token: "color/input-hover for the border; a checked or indeterminate box also takes state/hover-opacity"
    changes_for_user: "The whole piece responds, text included: the border gets one step darker."
  focus:
    token: "focus/border for the box border and a focus/halo band of focus/ring-width, radius focus/radius-inner; with error, status/error and focus/halo-error"
    changes_for_user: "For keyboard users, the box border changes color and a halo fills the 24 by 24 touch area, without changing the size."
  invalid:
    token: status/error
    changes_for_user: "The box border becomes status/error, checked or not; the error sentence stays outside the piece."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece loses opacity, leaves the Tab order, stops responding and is not submitted."
business_rules:
  - "Only a click on the box or on the text, or Space, by the person toggles the piece; Enter does not. The native input event crosses the shadow root and the host fires change, which bubbles and is not composed. Setting checked or indeterminate from code fires nothing."
  - "The checked attribute is the default state and the property is the current state, with the dirty flag of the native checkbox. A form reset goes back to the attribute, clears indeterminate and fires nothing."
  - "A checked piece submits name=value with the form; unchecked, nothing. indeterminate does not change what is submitted. A disabled piece, also inside a disabled fieldset, submits nothing."
  - "There is no required and no constraint validation: invalid never blocks the submission."
  - "disabled wins over invalid: a disabled piece draws no error border and has no aria-invalid. It is not an error case."
  - "Inside nph-field, the piece is an option of a group (nphFieldRole option): the field names and describes the group and writes invalid and disabled on each box."
  - "The change between unchecked, checked and indeterminate animates the fill, the border and the opacity of the mark on motion/state-duration and motion/state-easing. Width, height and position never animate. Under reduced motion it takes motion/hover-duration."
domain_errors:
  - "invalid: the choice needs a correction, such as terms that must be accepted. The piece shows the border; the sentence is written outside it, by the page or by nph-field."
tokens:
  box_size: icon/size-sm
  box_radius: radius/inner
  box_border: [border/width, color/input]
  box_fill: [color/background, color/primary]
  mark: [icon/size-sm, color/primary-foreground]
  touch_area_padding: space/inline-tight
  text_gap: space/inline
  text: text/label-md
  text_color: color/foreground
  hover: [color/input-hover, state/hover-opacity]
  invalid: status/error
  disabled: state/disabled-opacity
  focus: [focus/border, focus/halo, focus/ring-width, focus/radius-inner, status/error, focus/halo-error]
  motion: [motion/state-duration, motion/state-easing]
  motion_reduced: motion/hover-duration
ai_hints:
  - "Use nph-checkbox when the person can check more than one option, each independent, or turns one option on or off in a form."
  - "When the options exclude each other, use nph-radio; do not mix both in the same group."
  - "For a group of boxes, put them in nph-field, which names the group and carries the error message; a single box does not need nph-field."
  - "Give each box its own text; use the box alone only where the context already names it, and then fill in label."
  - "Set indeterminate only on the item that summarizes a group checked in part, and keep it in step from the page: the piece has no group logic."
  - "Give name and value for the form; read the state from event.target.checked on change."
  - "Keep links, such as the terms of use, outside the piece, next to it or above it."
accessibility:
  semantics: "A native input of type checkbox inside the component, in a label with the box and the text: role checkbox, with the state unchecked, checked or mixed. aria-invalid on the inner checkbox when invalid and not disabled."
  accessible_name: "The visible text. The box alone, the label, mandatory, as the aria-label of the inner checkbox; the box and the marks are aria-hidden. Known limit: a label element outside, pointing to the host, does not name the inner checkbox, because an id does not cross the shadow root; the piece brings its own text."
  keyboard:
    - "Tab enters and leaves the piece."
    - "Space toggles."
    - "Enter does nothing, as on the native checkbox."
  focus: "Keyboard only: the box border turns focus/border and a band of focus/ring-width in focus/halo fills the 24 by 24 touch area, with the radius focus/radius-inner; with error, the border stays status/error and the halo is focus/halo-error. Focus wins over hover; error wins over focus. Known limits, measured in the test: focus/border is below 3:1 against the halo in light `sistemas` (2.92:1), as design.md records; status/error is below 3:1 against focus/halo-error in dark, in every brand (1.96:1)."
  contrast: "The rule is 3:1 for the box border against the background (WCAG 1.4.11), 3:1 for the mark on the checked fill and 4.5:1 for the text; the test measures the seven brands in both schemes. The box border, color/input, measures 3.23:1 in light and 6.58:1 in dark. The mark, color/primary-foreground on color/primary, is at least 4.96:1. The error border, status/error, measures 6.88:1 in light and 5.01:1 in dark. Known limit: the checked fill, color/primary, is below 3:1 against the background in dark gerencial (2.71:1) and dark rh (2.88:1); the box border, which meets 3:1, keeps the box visible."
  color_alternative: "Checked and indeterminate show a mark, check or minus. The invalid piece changes its border and takes aria-invalid; the error sentence is written outside it."
invalid_combinations:
  - "disabled with invalid — disabled wins, and the error border is not drawn."
  - "The box alone without label — the piece has no accessible name and draws nothing."
  - "No text and no label — the piece has no accessible name and draws nothing."
relations:
  combines_with: [nph-icon, nph-radio, nph-field]
  parents: ["a form", "nph-field, which names a group of boxes"]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the piece when the options exclude each other, where nph-radio is the choice."
  - "Putting an nph-field around a single box only to give it a name."
  - "Mixing checkbox and radio in the same group."
  - "Putting a link or rich content in the text."
  - "Putting the error sentence inside the piece."
  - "Using indeterminate as an answer from the person."
  - "Painting the box or the mark by hand."
sources:
  design_md: "design.md, icon/size-sm, radius/inner, border/width, color/input, color/input-hover, color/background, color/primary, color/primary-foreground, color/foreground, status/error, space/inline-tight, space/inline, text/label-md, state/hover-opacity, state/disabled-opacity, focus/*, motion/* and the core icons check and minus"
  decision: "P81 — API, semantics and form participation of nph-checkbox, 22-10-2026; the form pattern of P80 and the field contract of P83"
  tests: "src/components/nph-checkbox/nph-checkbox.test.ts"
  usage_evidence: "none yet"
  storybook: "src/components/nph-checkbox/nph-checkbox.stories.ts and nph-checkbox.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Checkbox, frame nph-checkbox 1194:1033 and set 740:18776"
---

# nph-checkbox

## Function

**The problem it solves:** gives the person a box with its own text, to check independent
options or to turn one option on or off, and sends the choice with the form. The question
that separates it from `nph-radio`: can the person check two? If the options exclude each
other, the piece is `nph-radio`.

**When to use:**

- When the person can check more than one option, each independent.
- For a single option, which the person turns on or off.
- Indeterminate only on the item that summarizes a group checked in part: it is not an
  answer from the person.
- The box alone only when the name is already in the context, such as a table cell, always
  with `label`.

**When NOT to use:**

- **When the options exclude each other** — use `nph-radio`.
- **Around it, an `nph-field` only to give it a name** — the box already brings its own
  text.
- **To mix checkbox and radio in the same group.**
- **To put a link in the text, such as the terms of use** — the link stays outside the
  piece.
- **To paint the box or the mark by hand** — the piece takes its colors from tokens.

## Variants

**By appearance:** the Figma `marcado` — unchecked, checked (`checked`) and indeterminate
(`indeterminate`) — and the content, with text or the box alone (the Figma
`mostrar rótulo`).

| Variant | Choose when |
|---|---|
| Unchecked | The option is off |
| Checked | The option is on: the box is filled and shows `check` |
| Indeterminate | Only on the item that summarizes a group checked in part: the box shows `minus` |
| With text | In every case where the name must be visible |
| The box alone | The name is already in the context, such as a table cell; the piece takes `label` |

**By size:** `not_applicable`. Size is not a property: the box is **strictly**
`icon/size-sm` (16 × 16) and the touch area 24 × 24.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** the box alone without `label`.

## States

| State | Token | What changes for the person |
|---|---|---|
| Unchecked | fill `color/background`, border `color/input` | An empty box, with the text next to it |
| Checked | fill `color/primary`, mark `check` in `color/primary-foreground`; the border stays `color/input` | The box is filled and shows the check mark |
| Indeterminate | fill `color/primary`, mark `minus` in `color/primary-foreground` | The box is filled and shows the minus mark |
| Hover | border `color/input-hover`; checked or indeterminate, the box also takes `state/hover-opacity` | The whole piece responds, text included |
| Focus | border `focus/border` and a `focus/halo` band of `focus/ring-width`, radius `focus/radius-inner`; with error, `status/error` and `focus/halo-error` | The halo fills the 24 × 24 touch area, without changing the size |
| Invalid | `status/error` | The box border becomes `status/error`, checked or not; the sentence stays outside |
| Disabled | `state/disabled-opacity` | The whole piece loses opacity, text included, leaves the Tab order and is not submitted |

**Feedback and focus:** focus appears only for keyboard users and **is not removed**. The
border follows a strict precedence: error, then focus, then hover, then rest. `disabled`
**always wins** over `invalid`: a disabled piece draws no error border and has no
`aria-invalid`, and that is not an error case. The text is `color/foreground` in every
state. With text that wraps, the box sits at the top, centered on the first line. The change
between unchecked, checked and indeterminate animates the fill, the border and the opacity
of the mark on `motion/state-duration` and `motion/state-easing`; width, height and position
never animate. Under reduced motion the change takes `motion/hover-duration` and the fill
still changes.

**Business rule the piece carries:**

- Only a click on the box or on the text, or Space, by the person toggles the piece; Enter
  does not. The native `input` event crosses the shadow root and the host fires `change`,
  which bubbles and is not composed. Setting `checked` or `indeterminate` from code fires
  nothing.
- The `checked` attribute is the default state and the property is the current state, with
  the dirty flag of the native checkbox. A form reset goes back to the attribute, clears
  `indeterminate` and fires nothing.
- A checked piece submits `name=value` with the form; unchecked, nothing. `indeterminate`
  does not change what is submitted. A disabled piece, also inside a disabled `<fieldset>`,
  submits nothing. There is no `required` and no constraint validation.
- Inside `nph-field`, the piece is an option of a group (`nphFieldRole` `option`, the field
  contract of P83): the field names and describes the group and writes `invalid` and
  `disabled` on each box.

**Domain error states:** `invalid`. The choice needs a correction, such as terms that must
be accepted. The piece shows the border; the sentence is written outside it, by the page or
by `nph-field`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A native `input` of type `checkbox` inside the component, in a `label` with the box and the text: role `checkbox`, with the state unchecked, checked or mixed. `aria-invalid` on the inner checkbox when invalid and not disabled |
| Accessible name | The visible text. The box alone, the `label`, mandatory, as the `aria-label` of the inner checkbox; the box and the marks are `aria-hidden`. Known limit: a `label` element outside, pointing to the host, does not name the inner checkbox, because an id does not cross the shadow root; the piece brings its own text |
| Keyboard | Tab enters and leaves; Space toggles; Enter does nothing, as on the native checkbox |
| Focus | Keyboard only: the box border turns `focus/border` and a band of `focus/ring-width` in `focus/halo` fills the 24 × 24 touch area, with the radius `focus/radius-inner`; with error, the border stays `status/error` and the halo is `focus/halo-error`. Known limits, measured in the test: `focus/border` is below 3:1 against the halo in light `sistemas` (2.92:1), as `design.md` records; `status/error` is below 3:1 against `focus/halo-error` in dark, in every brand (1.96:1) |
| Contrast | 3:1 for the box border against the background (WCAG 1.4.11), 3:1 for the mark on the checked fill and 4.5:1 for the text; the test measures the seven brands in both schemes. The box border, `color/input`, measures 3.23:1 in light and 6.58:1 in dark. The mark is at least 4.96:1. The error border measures 6.88:1 in light and 5.01:1 in dark. Known limit: the checked fill, `color/primary`, is below 3:1 against the background in dark gerencial (2.71:1) and dark rh (2.88:1); the box border keeps the box visible |
| Alternative to color | Checked and indeterminate show a mark, `check` or `minus`. The invalid piece changes its border and takes `aria-invalid`; the error sentence is written outside it |
| Touch target | 24 × 24 around the 16 × 16 box (WCAG 2.5.8); the text is part of the click area |
| Motion | Under reduced motion the change takes `motion/hover-duration`, and the fill still changes |
| Forced colors and right to left | Not treated by the piece; a known limit shared by the form controls |

## Relations

**Combines with:** `nph-icon`, the `check` and `minus` marks; `nph-radio`, for options that
exclude each other, never in the same group; `nph-field`, which names a group of boxes and
carries the error message. The text is part of the piece, not an `nph-label`. `nph-radio` is
**planned** and does not exist yet.

**What is the parent:** a form; `nph-field`, for a group of boxes, stacked with
`space/stack-tight`.

**What is the child:** `nph-icon`, in `icon/size-sm`. The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Box | `icon/size-sm`, radius `radius/inner`, border `border/width` in `color/input` |
| Fill | `color/background`; checked and indeterminate `color/primary` |
| Mark | `icon/size-sm` in `color/primary-foreground` |
| Touch area | the box plus `space/inline-tight` on each side |
| Space to the text | `space/inline`, from the edge of the touch area |
| Text | `text/label-md` in `color/foreground` |
| Hover | `color/input-hover`; `state/hover-opacity` on a checked or indeterminate box |
| Invalid | `status/error` |
| Disabled | `state/disabled-opacity` |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width`, `focus/radius-inner`, `status/error` and `focus/halo-error` |
| Motion | `motion/state-duration` and `motion/state-easing`; `motion/hover-duration` under reduced motion |

**Usage restrictions:** the component does not choose size, color, radius or typography:
everything comes from a token. In a part of the screen with another brand, `data-nph-brand`
and `data-nph-color-scheme` go on the same element (P67). The `use` of some tokens in
`design.md` is narrower than the accepted Figma (`color/primary` as the fill of the box,
`space/inline-tight` on four sides, `state/hover-opacity` on the box and `icon/size-sm` as
the measure of the box): P81 records it for review.

**AI hints:**

- Use `nph-checkbox` when the person can check more than one option, each independent, or
  turns one option on or off in a form.
- When the options exclude each other, use `nph-radio`; do not mix both in the same group.
- For a group of boxes, put them in `nph-field`, which names the group and carries the
  error message; a single box does not need `nph-field`.
- Give each box its own text; use the box alone only where the context already names it,
  and then fill in `label`.
- Set `indeterminate` only on the item that summarizes a group checked in part, and keep it
  in step from the page: the piece has no group logic.
- Give `name` and `value` for the form; read the state from `event.target.checked` on
  `change`.
- Keep links, such as the terms of use, outside the piece, next to it or above it.

## Examples

**Recommended case:** consent — a single box with the text "I agree to the terms of use",
`name` and `value` set, in a form; the link to the terms sits next to it, outside the piece.

**Alternative case:** group selection — an "All files" box, indeterminate while only some of
the files below it are checked, kept in step by the page.

## Anti-patterns

- **Do not use it when the options exclude each other** — use `nph-radio`.
- **Do not put an `nph-field` around a single box only to give it a name** — the box brings
  its own text.
- **Do not mix checkbox and radio in the same group.**
- **Do not put a link or rich content in the text** — the text is plain.
- **Do not put the error sentence inside the piece** — it stays outside, written by the page
  or by `nph-field`.
- **Do not use indeterminate as an answer from the person** — it only summarizes a group.
- **Do not paint the box or the mark by hand** — the piece takes its colors from tokens.
- **Invalid combinations:** `disabled` with `invalid`, where `disabled` wins; the box alone
  without `label`; no text and no `label`.
- **Do not create without a decision:** a size, a variant, a slot, rich text, `required` or
  constraint validation, or group logic inside the piece.

## Sources and decisions

- **The repository `design.md`:** `icon/size-sm`, `radius/inner`, `border/width`,
  `color/input`, `color/input-hover`, `color/background`, `color/primary`,
  `color/primary-foreground`, `color/foreground`, `status/error`, `space/inline-tight`,
  `space/inline`, `text/label-md`, `state/hover-opacity`, `state/disabled-opacity`,
  `focus/*`, `motion/*` and the core icons `check` and `minus`.
- **The decision that originated it:** P81, of 22-10-2026, with the form pattern of P80 and
  the field contract of P83. The frame was accepted by Indiane on 01-10-2026; D1 to D6 were
  answered on 19-10-2026.
- **Tests:** `src/components/nph-checkbox/nph-checkbox.test.ts`.
- **Usage evidence:** none yet.
- **Storybook:** `src/components/nph-checkbox/nph-checkbox.stories.ts` (Validation) and
  `nph-checkbox.docs.stories.ts` (Docs).
- **Figma:** page `NPH — Checkbox`, frame `nph-checkbox` (`1194:1033`) and set
  `740:18776` in `DS-IA-NEPHOS 5.0`.
