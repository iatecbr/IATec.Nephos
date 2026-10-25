---
piece: nph-radio
level: component
status: active
solves: >-
  Lets the person choose one option in a small group of options that exclude each
  other, all visible at the same time; checking one unchecks the others.
use_when:
  - "When the options exclude each other: payment method, employment type, work shift."
  - "When the group is small and fits the screen, with two to five options."
  - "When every option must stay visible at the same time, so the person compares before choosing."
  - "Always in a group of two or more, with one option checked when there is a reasonable default."
do_not_use_when:
  - "When the person can check more than one option: use nph-checkbox."
  - "For a single option, alone: either options are missing, or the piece is nph-checkbox."
  - "With more than five options: use nph-select."
  - "When the person needs to uncheck by clicking again: offer a None option, or use nph-checkbox."
  - "To mix radios and checkboxes in the same group."
api:
  checked:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The current state, the Figma marcado. The checked attribute is the initial
      state and the one form.reset() returns to; a later change of the attribute
      moves the current state only while neither the person nor code changed
      checked. Setting it from code unchecks the other radios of the group and
      fires no event. There is no indeterminate.
  name:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The group and the key in the form. Radios with the same non-empty name, in
      the same root and with the same form owner, are one group. It reflects
      because the form reads the attribute of the host; an empty name writes no
      attribute. Without a name, the radio is a group of one and warns in
      development.
  value:
    type: string
    required: false
    default: "on"
    reflects: true
    constraint: >-
      What the checked radio submits, under name. Only the checked radio of a group
      enters the form. The default, on, is also written as the attribute, and
      removing the attribute gives back on. A radio that is not drawn submits
      nothing.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The visible text, already localized; it is also the accessible name. Without
      it, the piece is only the 24 by 24 circle: the Figma property that shows the
      text, turned off.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name when there is no text, never visible. Without text,
      label, aria-label or aria-labelledby on the host (an empty or blank one
      counts as none), the radio draws nothing and emits console.error in
      development. With text, label is not used.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error border, checked or not. Visual only: aria-invalid is not
      supported on the radio role, and the error sentence belongs to nph-field.
      disabled wins over it.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity, text included, out of the Tab
      order and the arrow keys, and the click does not check it. A disabled
      fieldset around the radio does the same. It wins over invalid.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event, fired on the host when the person checks the radio:
      it bubbles and crosses the shadow root. Read event.target.value. A change
      from code never fires it.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native change event, fired on the host right after input, when the
      person checks the radio: it bubbles and does not cross the shadow root. A
      change from code never fires it.
variants:
  checked:
    axis: state
    choose_when: "checked for the option chosen, unchecked for the others. One option checked when there is a reasonable default."
    do_not_combine_with:
      - "two checked radios in the same group: the last one wins."
  text:
    axis: appearance
    choose_when: "With text, always, except when the name is already in the context, such as a card in nph-rich-option, where the radio is the circle alone with label."
    do_not_combine_with: []
states:
  default:
    token: "color/background fill and color/input border; checked, color/primary fill and color/primary-foreground dot"
    changes_for_user: "Unchecked is an empty circle; checked is filled, with the dot. The border stays color/input in both."
  hover:
    token: "color/input-hover border; checked, state/hover-opacity on the circle"
    changes_for_user: "The border goes one step up, so the circle responds to the mouse; it has no size change."
  focus:
    token: "focus/border border and focus/halo halo, focus/ring-width, radius/full"
    changes_for_user: "Keyboard only: the border turns focus/border and the halo covers the 24 by 24 touch area."
  error:
    token: "status/error border; with focus, focus/halo-error halo"
    changes_for_user: "The border turns status/error, checked or not; the checked fill stays color/primary. The sentence is in nph-field."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece, text included, loses opacity and stops responding. It does not combine with error: disabled wins."
business_rules:
  - "Radios with the same name, in the same root and with the same form owner, are one group: checking one unchecks the others."
  - "The person never unchecks a radio by clicking it again: a click on the checked radio changes nothing and fires no event, and the click still bubbles."
  - "Only the person checking a radio, by click, Space or an arrow key, fires input and change; setting checked from code never fires them."
  - "One Tab stop per group, on the checked radio or, with none checked, on the first one that responds; the arrow keys move the focus and check, wrapping, skipping a disabled radio."
  - "Only the checked radio enters the form, as name=value; form.reset() returns each radio to its checked attribute."
  - "Without a name, or alone in its group, the radio still renders and warns in development: a radio never shows alone."
domain_errors:
  - "invalid: the group failed validation. Every radio shows the status/error border; the sentence that says what to fix is the error message of nph-field."
tokens:
  circle: "icon/size-sm, radius/full, border/width"
  circle_border: "color/input; hover color/input-hover; error status/error; focus focus/border"
  fill: "color/background; checked color/primary"
  dot: "color/primary-foreground; 8 by 8, the circle minus space/inline-tight on each side"
  touch_area: "the circle plus space/inline-tight on each side: 24 by 24"
  gap: space/inline
  text: "text/label-md, color/foreground"
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width"
  states: "state/hover-opacity, state/disabled-opacity"
  motion: "motion/state-duration and motion/state-easing; reduced, motion/hover-duration"
ai_hints:
  - "Use nph-radio when the options exclude each other and there are two to five of them; if the person can check more than one, use nph-checkbox; with more than five, nph-select."
  - "Give every radio of a group the same name and its own value; put the group inside an nph-field, which names it and carries the error message."
  - "Read the chosen value from event.target.value on change; do not listen to click."
  - "Put the checked attribute on the default option; it is also the state the form returns to on reset."
  - "Set invalid on every radio of the group, together with the error message in nph-field; never leave a radio red without a sentence."
  - "Use the circle alone, with label, only where the name is already in the context, such as a card of nph-rich-option."
  - "Offer a None option when the person may want no choice: a radio cannot be unchecked by clicking again."
accessibility:
  semantics: "The host is the control: role radio, with aria-checked and aria-disabled, through ElementInternals. There is no inner input. The group, role radiogroup with its name, comes from nph-field."
  accessible_name: "The text is the name of the control. Without text, label is the name; aria-label or aria-labelledby on the host also count. The group gets the name of nph-field."
  keyboard:
    - "Tab enters the group on the checked radio or, with none checked, on the first one that responds; the next Tab leaves the group."
    - "Arrow down and arrow right move to the next radio and check it, wrapping; arrow up and arrow left, to the previous one."
    - "Space checks the focused radio."
    - "A disabled radio is out of the Tab order and the arrow keys skip it; so is a radio hidden by display: none, on itself or on an ancestor."
  focus: "Keyboard only: the circle border turns focus/border and a focus/halo halo covers the 24 by 24 touch area, fully round. With error, the border stays status/error and the halo is focus/halo-error. A mouse click does not show it."
  contrast: "The circle outline in color/input: 3.23:1 in light and 6.58:1 in dark; the text, 21:1 and 14.73:1. The test measures the dot on the checked fill and the error border in every brand and scheme. Known limit: in light mode of the default brand, focus/border measures 2.92:1 against the halo, as design.md records."
  color_alternative: "The border says the state and the fill and the dot say the choice; the error has the sentence in nph-field."
invalid_combinations:
  - "No text, no label, no aria-label and no aria-labelledby — the radio draws nothing."
  - "invalid with disabled — disabled wins: no error border, and it is not a console error."
  - "A radio without name, or alone in its group — it renders and warns in development."
  - "Two checked radios in the same group — the last one wins."
relations:
  combines_with: [nph-field, nph-rich-option]
  parents: [nph-field, form]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using radios when the person can check more than one option."
  - "A radio alone."
  - "More than five options in a radio group."
  - "Expecting the person to uncheck by clicking again."
  - "Mixing radios and checkboxes in the same group."
  - "A red radio without a sentence that explains the error."
  - "Painting the circle or the dot by hand."
sources:
  design_md: "design.md, color/input, color/input-hover, color/primary, color/primary-foreground, color/background, color/foreground, status/error, state/hover-opacity, state/disabled-opacity, focus/border, focus/halo, focus/halo-error, focus/ring-width, radius/full, icon/size-sm, border/width, space/inline-tight, space/inline, text/label-md and motion"
  decision: "P82 — API and semantics of nph-radio; P80 — the form pattern; P83 — the field contract"
  tests: "src/components/nph-radio/nph-radio.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-radio/nph-radio.stories.ts and nph-radio.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-radio frame 1196:311 and set 848:66"
---

# nph-radio

## Function

**The problem it solves:** lets the person choose one option in a small group of options
that exclude each other, all visible at the same time; checking one unchecks the others.
The group is not a component: it is several `nph-radio` with the same `name`, inside an
`nph-field` that names it and carries the error message.

**When to use:**

- When the options exclude each other: payment method, employment type, work shift.
- When the group is small and fits the screen, with two to five options.
- When every option must stay visible at the same time, so the person compares before
  choosing.
- Always in a group of two or more, with one option checked when there is a reasonable
  default.

**When NOT to use:**

- **When the person can check more than one option** — use `nph-checkbox`.
- **For a single option, alone** — either options are missing, or the piece is
  `nph-checkbox`.
- **With more than five options** — use `nph-select`.
- **When the person needs to uncheck by clicking again** — offer a "None" option, or use
  `nph-checkbox`.
- **To mix radios and checkboxes in the same group.**

## Variants

**By state:** `checked`, the Figma `marcado`, `false` or `true`. There is no indeterminate.

**By appearance:** with text, or the circle alone (the Figma `mostrar rótulo` off), which
is 24 × 24 and needs `label`.

| Variant | Choose when |
|---|---|
| Unchecked | The options the person did not choose |
| Checked | The chosen option, or the reasonable default |
| With text | Always, by default |
| Circle alone | The name is already in the context, such as a card of `nph-rich-option`; `label` is required |

**By size:** `not_applicable`. The circle is always `icon/size-sm`, 16, in a 24 × 24 touch
area.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** two checked radios in the same group (the last one wins).

## States

The border says the state; the fill and the dot say the choice.

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/background` fill, `color/input` border; checked: `color/primary` fill, `color/primary-foreground` dot | Unchecked is an empty circle; checked is filled, with the dot |
| Hover | `color/input-hover` border; checked: `state/hover-opacity` on the circle | The circle responds to the mouse, with no size change |
| Focus | `focus/border` border, `focus/halo` halo of `focus/ring-width`, `radius/full` | Keyboard only: the halo covers the 24 × 24 touch area |
| Error | `status/error` border; with focus, `focus/halo-error` halo | The border turns red, checked or not; the checked fill stays |
| Disabled | `state/disabled-opacity` | The whole piece, text included, loses opacity and stops responding |

**Feedback and focus:** the change from unchecked to checked, and back, animates the fill and
the border on `motion/state-duration` and `motion/state-easing`, and the dot fades in and
out by opacity on the same pair. Under `prefers-reduced-motion` it takes
`motion/hover-duration`, the semantic alias of `core/duration/100`; the color still
changes. Width, height and position never animate. The focus shows only for the keyboard.

**Business rule the piece carries:**

- Radios with the same `name`, in the same root and with the same form owner, are one group:
  checking one unchecks the others.
- The person never unchecks a radio by clicking it again: a click on the checked radio
  changes nothing and fires no event, and the `click` still bubbles.
- Only the person checking a radio, by click, Space or an arrow key, fires `input` and
  `change`; setting `checked` from code never fires them.
- One Tab stop per group; the arrow keys move the focus and check.
- Only the checked radio enters the form, as `name=value`; `form.reset()` returns each radio
  to its `checked` attribute.
- Without a `name`, or alone in its group, the radio still renders and warns in development.

**Domain error states:** `invalid`. The group failed validation: every radio shows the
`status/error` border, and the sentence that says what to fix is the error message of
`nph-field`. `invalid` and `disabled` do not combine: `disabled` wins.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is the control: `role` radio with `aria-checked` and `aria-disabled`, through `ElementInternals`. There is no inner input. The group, `role` radiogroup with its name, comes from `nph-field` |
| Accessible name | The text is the name of the control. Without text, `label` is the name; `aria-label` or `aria-labelledby` on the host also count. A `<label for>` pointing at the radio checks it and is one of its `labels` |
| Keyboard | Tab enters the group on the checked radio or, with none checked, on the first one that responds. The arrow keys move to the next or previous radio and check it, wrapping, skipping a disabled one. Space checks the focused radio |
| Focus | Keyboard only: `focus/border` border and a `focus/halo` halo on the 24 × 24 touch area; with error, `status/error` and `focus/halo-error` |
| Contrast | The circle outline in `color/input`: 3.23:1 in light and 6.58:1 in dark; the text, 21:1 and 14.73:1. The dot on the checked fill and the error border pass 3:1 in every brand and scheme |
| Alternative to color | The fill and the dot say the choice; the error has its sentence in `nph-field` |
| Touch target | A 24 × 24 area around the 16 circle; the text next to it also checks the option |

**Known limits:**

- Outside a `radiogroup`, the screen reader does not announce the group name or the
  position ("1 of 3"): that comes from `nph-field`.
- `invalid` is not announced on the radio: `aria-invalid` is not supported on the `radio`
  role, and it belongs to the group.
- In light mode of the default brand, `focus/border` measures 2.92:1 against the halo, as `design.md`
  records.
- The piece owns the `tabindex` of the host: a `tabindex` the consumer writes is replaced.
- The arrow keys are physical; there is no right-to-left mirroring, and `forced-colors` is
  not treated.

## Relations

**Combines with:** `nph-field`, which names the group, says it is required and carries the
error message (P83: it reads `nphFieldRole` `radio` and wraps the options in a
`radiogroup`); `nph-rich-option`, which may use the circle alone with `label` when the card
is an exclusive choice. `nph-checkbox`, for options that do not exclude each other, and
`nph-select`, for more than five options.

**What is the parent:** `nph-field`, or a `form`.

**What is the child:** nothing; the dot is a shape, not a piece from another set.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Circle | `icon/size-sm`, `radius/full`, `border/width` |
| Circle border | `color/input`; hover `color/input-hover`; error `status/error`; focus `focus/border` |
| Fill | `color/background`; checked `color/primary` |
| Dot | `color/primary-foreground`; 8 × 8, the circle minus `space/inline-tight` on each side |
| Touch area | The circle plus `space/inline-tight` on each side |
| Space to the text | `space/inline`, from the edge of the touch area |
| Text | `text/label-md`, `color/foreground` |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width` |
| States | `state/hover-opacity`, `state/disabled-opacity` |
| Motion | `motion/state-duration`, `motion/state-easing`; reduced, `motion/hover-duration` |

**Usage restrictions:** only semantic tokens. The `use` of some tokens in `design.md` is
narrower than the accepted frame: `radius/full` ("never on a field"), `state/hover-opacity`
(written for the button), `color/input` (it names checkbox, not radio) and `icon/size-sm` as
the size of a box, not of an icon. The accepted frame prevails; widening the `use` is a
decision of Indiane, recorded in P82. In a part of the screen with another brand,
`data-nph-brand` and `data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-radio` when the options exclude each other and there are two to five of them; if
  the person can check more than one, use `nph-checkbox`; with more than five, `nph-select`.
- Give every radio of a group the same `name` and its own `value`; put the group inside an
  `nph-field`, which names it and carries the error message.
- Read the chosen value from `event.target.value` on `change`; do not listen to `click`.
- Put the `checked` attribute on the default option; it is also the state the form returns
  to on reset.
- Set `invalid` on every radio of the group, together with the error message in
  `nph-field`; never leave a radio red without a sentence.
- Use the circle alone, with `label`, only where the name is already in the context, such as
  a card of `nph-rich-option`.
- Offer a "None" option when the person may want no choice: a radio cannot be unchecked by
  clicking again.

## Examples

**Recommended case:** payment method, with three options — credit card, Pix and bank slip —
the first one checked by default, inside an `nph-field` named "Payment method".

**Alternative case:** employment type, an exclusive choice with no default; or work shift,
a small group of three, all visible.

## Anti-patterns

- **Do not use radios when the person can check more than one option** — use
  `nph-checkbox`.
- **Do not show a radio alone** — either options are missing, or the piece is
  `nph-checkbox`.
- **Do not put more than five options in a group** — use `nph-select`.
- **Do not expect the person to uncheck by clicking again** — offer "None".
- **Do not mix radios and checkboxes in the same group.**
- **Do not leave a radio red without a sentence** — the error message is in `nph-field`.
- **Do not paint the circle or the dot by hand.**
- **Invalid combinations:** no text and no name; `invalid` with `disabled`, where disabled
  wins; a radio without `name` or alone in its group, which warns; two checked radios in the
  same group, where the last one wins.
- **Do not create without a decision:** a size, an indeterminate state, a `required`
  property, a slot, a `::part` or a color property.

## Sources and decisions

- **The repository `design.md`:** the tokens of the table above and the motion rules
  (`movimento_reduzido`).
- **The decision that originated it:** P82, of 22-10-2026, with the form pattern of P80 and
  the field contract of P83. The frame was accepted by Indiane on 01-10-2026; D1 to D3 read
  from the accepted set and D4 and D5 answered on 19-10-2026. Open with Indiane: D6 (the
  alignment with the first line) and D7 (`invalid` with `disabled`), and the reduced-motion
  duration, D7 of DSA-22.
- **Tests:** `src/components/nph-radio/nph-radio.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-radio/nph-radio.stories.ts` (Validation) and
  `nph-radio.docs.stories.ts` (Docs).
- **Figma:** `nph-radio` frame (`1196:311`) and set `848:66` in `DS-IA-NEPHOS 5.0`.
