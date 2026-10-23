---
piece: nph-slider
level: component
status: active
solves: >-
  Lets the person pick a value, or a range, on a continuous scale of numbers, by
  dragging a thumb or with the arrow keys, and takes part in the form that contains it.
use_when:
  - "single, to pick an approximate value on a scale, such as volume or brightness."
  - "range, to filter by a range, such as a minimum and a maximum price."
  - "vertical, in a narrow panel or for a setting that goes up and down, such as volume or zoom."
  - "text, outside nph-field, when the person needs to see the number while adjusting."
  - "limits, when the ends of the scale are not obvious to the person."
  - "marks, when only some values are valid, in fixed steps."
  - "inputs, when the exact number matters and the person may want to type it."
  - "steppers, when fine adjustment is common or dragging is hard, as on a touch screen."
  - "Inside nph-field when the value breaks a rule: the field gives the error message."
do_not_use_when:
  - "To show progress: that is a progress bar, which is not operated."
  - "range to pick a single value: use single."
  - "vertical in a common form: the horizontal one follows the reading."
  - "text inside nph-field: the label comes out twice."
  - "limits together with marks: the marks already show the ends."
  - "marks on a continuous scale: use limits."
  - "Alone when the person often types exact numbers: turn on inputs or use nph-input."
  - "steppers without a defined step: each click needs to move one clear step."
api:
  orientation:
    type: enum
    values: [horizontal, vertical]
    required: false
    default: horizontal
    reflects: true
    constraint: >-
      The vertical one serves a narrow panel; its minimum is at the bottom, and only
      text and limits exist in it. Reflects because the internal CSS selects the parts by
      it. Any other value draws nothing and emits console.error in development.
  mode:
    type: enum
    values: [single, range]
    required: false
    default: single
    reflects: true
    constraint: >-
      single picks one value with one thumb; range picks a start and an end with two
      thumbs. Reflects because the internal CSS selects the parts by it. Any other value
      draws nothing and emits console.error in development.
  min:
    type: number
    required: false
    default: "0"
    reflects: false
    constraint: >-
      The lowest value of the scale. It must be below max; otherwise the slider draws
      nothing and emits console.error in development.
  max:
    type: number
    required: false
    default: "100"
    reflects: false
    constraint: >-
      The highest value of the scale. When it is off the step, the slider stops at the last
      step below it.
  step:
    type: number
    required: false
    default: "1"
    reflects: false
    constraint: >-
      The distance between two values the slider stops on. Every value is rounded to it.
      It must be a positive number; otherwise the slider draws nothing and emits
      console.error in development.
  value:
    type: number
    required: false
    default: "the middle of the scale"
    reflects: false
    constraint: >-
      The current value, in single. The value attribute is the initial value and the value
      of form.reset(), as in the native range: it applies only while the person has not
      moved the slider and setting the property has not made it dirty. Setting it from code
      fires no event.
  start:
    type: number
    required: false
    default: "min"
    reflects: false
    constraint: >-
      The start of the range, in range, with the same rule as value. It never passes end.
  end:
    type: number
    required: false
    default: "max"
    reflects: false
    constraint: >-
      The end of the range, in range, with the same rule as value. It never comes before
      start.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entry in the form data. single submits name=value; range submits two
      entries under the same name, start and end. Reflects because the form reads the
      attribute of the host.
  text:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The visible label, already localized, drawn by an nph-label with the current value
      beside it, above the track. Empty turns the part off. Off inside nph-field, which
      already gives the label.
  limits:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Turns on the minimum and the maximum at the ends of the track. Not together with marks.
  marks:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Turns on one label per step under the track, from min to max, at most 100. Horizontal
      only. In the vertical orientation, or above 100 steps, it is not drawn and emits
      console.error in development; the step does not change.
  inputs:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Turns on an nph-input with the number: one at the end in single, one at each end in
      range. The number is applied when the person presses Enter or leaves the field.
      Horizontal only.
  steppers:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Turns on the minus and plus buttons, which move one step. Horizontal only. Requires
      decrease-label and increase-label: without them, the buttons are not drawn and the
      slider emits console.error in development.
  start-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      In range, the accessible name of the start thumb and of its field, already
      localized. Without it, the slider renders and warns in development.
  end-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      In range, the accessible name of the end thumb and of its field, already localized.
      Without it, the slider renders and warns in development.
  decrease-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the minus button, already localized. Required with steppers.
  increase-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the plus button, already localized. Required with steppers.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name in text, never visible, for a slider with no associated label;
      nph-field writes it. An associated label wins over it, and it wins over text.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error sentence
      that nph-field writes. It is read as the description of each thumb.
  required:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      Written by nph-field (P83). A slider always has a value, so it has no effect and is
      not announced.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole slider at state/disabled-opacity, once; the thumbs leave the Tab order and
      the form data. A disabled fieldset disables it too. It wins over invalid.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error state: the thumb border becomes status/error and each thumb gets
      aria-invalid. The sentence belongs to nph-field; never invalid without it.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event, while the value moves: at each key, click and drag step. It
      bubbles and crosses the shadow root. Read the value from the host.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native change event, when the value settles: after a key or a click, and on the
      release of a drag that changed it. It bubbles. Setting a value from code fires
      neither event.
variants:
  orientation:
    axis: orientation
    choose_when: "horizontal in general use; vertical in a narrow panel or for a setting that goes up and down."
    do_not_combine_with:
      - "vertical with marks, inputs or steppers."
  mode:
    axis: appearance
    choose_when: "single for one value; range for a start and an end."
    do_not_combine_with:
      - "range to pick a single value."
  parts:
    axis: appearance
    choose_when: "text, limits, marks, inputs and steppers each turned on by a property, without creating a variant."
    do_not_combine_with:
      - "limits with marks."
      - "text inside nph-field."
states:
  default:
    token: color/primary-border
    changes_for_user: "The thumb at rest, with the color/primary-border border on color/background."
  hover:
    token: color/tooltip
    changes_for_user: "The value balloon opens above the thumb under the pointer."
  focus:
    token: focus/border
    changes_for_user: "The thumb border takes focus/border with the focus/halo outside, at focus/ring-width; the balloon opens."
  error:
    token: status/error
    changes_for_user: "The thumb border is status/error; the inner fields show their error; the sentence is in nph-field."
  error-focus:
    token: focus/halo-error
    changes_for_user: "The border stays status/error and the halo is focus/halo-error; the balloon opens."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole slider at state/disabled-opacity, once; it does not respond, shows no balloon and wins over the error."
business_rules:
  - "Every value is rounded to the step and kept inside the scale, as the native range does."
  - "In range, each thumb stops at the other."
  - "A key, minus and plus fire input and change; a drag fires input at each value and change on release; setting a value from code fires nothing."
  - "The field applies the number on Enter or when the person leaves it; a text that is not a number goes back to the value."
  - "Minus and plus move the thumb used last, the start one by default (D2)."
  - "disabled wins over invalid: no error look on a slider the person cannot move."
domain_errors:
  - "invalid: the value breaks a rule; nph-field writes the sentence and passes it as description."
tokens:
  width: layout/input-width
  gap: "space/stack-tight between the top line, the track and the marks; space/inline between the track and the parts beside it"
  track: "color/input empty and color/primary active, space/inline-tight thick, radius/full"
  thumb: "icon/size-sm, radius/full, color/background, border/width in color/primary-border"
  touch_target: control/height-large
  balloon: "the nph-tooltip tokens"
  value: "text/label-md in color/foreground"
  limits_and_marks: "text/caption in color/muted-foreground"
  focus: "focus/border, focus/halo, focus/halo-error and focus/ring-width"
  error: status/error
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-slider when the position on the scale matters more than the exact number; when the exact number matters, turn on inputs or use nph-input."
  - "Put nph-slider inside nph-field when it needs a help or an error message, and leave text off there."
  - "Give a range slider start-label and end-label: each thumb has a name of its own."
  - "Read value, or start and end, from the host on input or change; do not listen for an nph-* event."
  - "Give steppers decrease-label and increase-label."
  - "Do not use it to show progress."
accessibility:
  semantics: "Each thumb is an element with role=slider, with aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext and aria-orientation; in range, an inner group holds the two thumbs. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host: nph-label for, a label element or nph-field. Without one, from label, then from text. In single, the name goes on the thumb; in range, on the group, and each thumb takes start-label or end-label. With no name, the slider renders and warns in development."
  keyboard:
    - "Tab enters each thumb, then the field and the buttons."
    - "The arrows move one step: Right and Up raise, Left and Down lower."
    - "Page Up and Page Down move a tenth of the scale."
    - "Home and End go to the ends; in range, to the other thumb."
  focus: "The thumb shows the focus border and the halo on keyboard focus, and the balloon opens."
  contrast: "The thumb border meets 3:1 against the background in both modes; the active part of the track is support. Support texts meet 4.5:1."
  color_alternative: "The error is said by the sentence of nph-field, read as the description of each thumb; the current value is a number, in the balloon, in the label or in the field."
invalid_combinations:
  - "An orientation outside horizontal and vertical — the slider draws nothing."
  - "A mode outside single and range — the slider draws nothing."
  - "min not below max, or a step that is not a positive number — the slider draws nothing."
  - "marks, inputs or steppers in the vertical orientation — the part is not drawn."
  - "marks on a scale of more than 100 steps — the marks are not drawn."
  - "steppers without decrease-label and increase-label — the buttons are not drawn."
  - "limits with marks, and text inside nph-field — the slider renders and warns."
  - "invalid without the sentence in nph-field — red with no text."
relations:
  combines_with: [nph-field, nph-label, nph-tooltip, nph-input, nph-button, nph-icon]
  parents: [nph-field, "form"]
  children: [nph-label, nph-tooltip, nph-input, nph-button]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it to show progress."
  - "Showing the error only through the thumb color."
  - "Replacing the balloon with a fixed text above the thumb: use text."
  - "Turning on text inside nph-field."
  - "Turning on limits together with marks."
  - "Using marks on a continuous scale."
  - "Using vertical in a common form."
sources:
  design_md: "design.md, color/input, color/primary, color/primary-border, status/error, focus/*, state/disabled-opacity, icon/size-sm, control/height-large, layout/input-width, space/*, text/label-md and text/caption"
  decision: "P94 — API and semantics of nph-slider; the form pattern is P80 and the field contract is P83"
  tests: "src/components/nph-slider/nph-slider.test.ts"
  usage_evidence: "the Examples section of the nph-slider Docs page"
  storybook: "src/components/nph-slider/nph-slider.stories.ts and nph-slider.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-slider board 1636:46, frame 1925:642 and set 1636:44"
---

# nph-slider

## Function

**The problem it solves:** lets the person pick a value, or a range, on a continuous scale of
numbers, by dragging a thumb or with the arrow keys, and takes part in the form that contains
it. Use it when the position on the scale matters more than the exact number: volume,
brightness, a price range. The help and the error message belong to `nph-field`.

**When to use:**

- `single`, to pick an approximate value on a scale, such as volume or brightness.
- `range`, to filter by a range, such as a minimum and a maximum price.
- `vertical`, in a narrow panel or for a setting that goes up and down, such as volume or zoom.
- `text`, outside `nph-field`, when the person needs to see the number while adjusting.
- `limits`, when the ends of the scale are not obvious to the person.
- `marks`, when only some values are valid, in fixed steps.
- `inputs`, when the exact number matters and the person may want to type it.
- `steppers`, when fine adjustment is common or dragging is hard, as on a touch screen.
- Inside `nph-field` when the value breaks a rule: the field gives the error message.

**When NOT to use:**

- **To show progress** — that is a progress bar, which is not operated.
- **`range` to pick a single value** — use `single`.
- **`vertical` in a common form** — the horizontal one follows the reading.
- **`text` inside `nph-field`** — the label comes out twice.
- **`limits` together with `marks`** — the marks already show the ends.
- **`marks` on a continuous scale** — use `limits`.
- **Alone when the person often types exact numbers** — turn on `inputs` or use `nph-input`.
- **`steppers` without a defined step** — each click needs to move one clear step.

## Variants

**By appearance:** `mode` — `single`, one thumb, or `range`, two thumbs, start and end. The
optional parts — `text`, `limits`, `marks`, `inputs` and `steppers` — are each turned on by a
property and do not create a variant.

**By orientation:** `horizontal` and `vertical`; in the vertical one the minimum is at the
bottom, and only `text` and `limits` exist.

**By size:** `not_applicable`. **By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| `single` | One approximate value, such as volume |
| `range` | A start and an end, such as a price filter |
| `vertical` | A narrow panel, or a setting that goes up and down |
| `text` | Outside `nph-field`, the person needs to see the number |
| `limits` | The ends are not obvious |
| `marks` | Only some values are valid, in fixed steps |
| `inputs` | The exact number matters |
| `steppers` | Fine adjustment is common, or dragging is hard |

**Do not combine with:** `marks`, `inputs` or `steppers` in the vertical orientation; `limits`
with `marks`; `text` inside `nph-field`.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/primary-border` | The thumb at rest, on `color/background` |
| `hover` | `nph-tooltip` | The value balloon opens above the thumb |
| `foco` | `focus/border`, `focus/halo` | The thumb border takes `focus/border` and the halo sits outside, at `focus/ring-width`; the balloon opens |
| `erro` | `status/error` | The thumb border is `status/error`; the inner fields show their error |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error`; the balloon opens |
| `disabled` | `state/disabled-opacity` | The whole slider at `state/disabled-opacity`, once; no balloon |

**Feedback and focus:** `disabled` wins over everything; `erro` keeps its border on focus. The
track does not change with the state: the active part stays `color/primary` and the empty part
`color/input`. The balloon opens on hover and on keyboard focus, by the rules of `nph-tooltip`,
and stays open while a thumb is dragged. When the slider is disabled, the inner field and buttons
keep `state=default`: they become inert, so the slider fades only once.

**Business rule the piece carries:**

- Every value is rounded to the step and kept inside the scale, as the native range does.
- In `range`, each thumb stops at the other.
- A key, minus and plus fire `input` and `change`; a drag fires `input` at each value and
  `change` on release; setting a value from code fires nothing.
- The field applies the number on Enter or when the person leaves it; a text that is not a
  number goes back to the value.
- Minus and plus move the thumb used last, the start one by default (D2).
- `disabled` wins over `invalid`.

**Domain error states:** `invalid`, when the value breaks a rule. `nph-field` writes the
sentence and passes it to the slider as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Each thumb is an element with `role="slider"`, with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` and `aria-orientation`; in `range`, an inner group holds the two thumbs. The host is form-associated and labelable: `host.labels` and `host.form` work as in a native control |
| Accessible name | From the label associated with the host — `nph-label for`, a `label` element or `nph-field`. Without one, from `label`, then from `text`. In `single`, on the thumb; in `range`, on the group, and each thumb takes `start-label` or `end-label`. Minus and plus take `decrease-label` and `increase-label`. With no name, the slider renders and warns in development |
| Description | `description`, read as the description of each thumb: the help or the error sentence of `nph-field` |
| Keyboard | Tab enters each thumb, then the field and the buttons. The arrows move one step; Page Up and Page Down a tenth of the scale; Home and End go to the ends |
| Focus | On keyboard focus the thumb takes `focus/border` and the halo outside, without changing the size, and the balloon opens |
| Contrast | The thumb border meets 3:1 against the background in both modes (WCAG 1.4.11); the active part of the track is support. Support texts meet 4.5:1 |
| Alternative to color | The error is said by the sentence of `nph-field`; the current value is a number, in the balloon, in the label or in the field |
| Touch target | The thumb is drawn at `icon/size-sm`; its target is a circle of `control/height-large` centered on it. Minus and plus are `nph-button` in `size=default` |
| Known limits | Forced colors and right-to-left are not treated yet. Moving the value by the swipe gesture of a mobile screen reader depends on the browser sending the arrow keys to an ARIA `slider` |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help and the error; `nph-label`,
which names it on its own with `for` and draws `text`; `nph-tooltip`, the value balloon;
`nph-input`, the field; `nph-button` and `nph-icon`, minus and plus.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-label`, `nph-tooltip`, `nph-input` and `nph-button`, inside its
shadow root.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Root | Width `layout/input-width`; `space/stack-tight` between the top line, the track and the marks |
| Track | `color/input` empty and `color/primary` active, `space/inline-tight` thick, `radius/full` |
| Thumb | `icon/size-sm`, `radius/full`, `color/background`, `border/width` in `color/primary-border`; touch target `control/height-large` |
| Value balloon | The `nph-tooltip` tokens |
| Label and value | `nph-label`; the value in `text/label-md`, `color/foreground` |
| Minimum, maximum and marks | `text/caption`, `color/muted-foreground` |
| Parts beside the track | `space/inline` from the track |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width` |
| Error | `status/error` |
| Disabled | `state/disabled-opacity` |

**Usage restrictions:** the width may stretch to the parent, with no minimum. A field shares the
line with the track, one part for the field and three for the track: the evidence gives it no
width of its own (D5). In the vertical orientation the track takes `layout/input-width` of
height (D3). There is no motion of its own.

**AI hints:**

- Use `nph-slider` when the position on the scale matters more than the exact number; when the
  exact number matters, turn on `inputs` or use `nph-input`.
- Put `nph-slider` inside `nph-field` when it needs a help or an error message, and leave `text`
  off there.
- Give a `range` slider `start-label` and `end-label`: each thumb has a name of its own.
- Read `value`, or `start` and `end`, from the host on `input` or `change`; do not listen for an
  `nph-*` event.
- Give `steppers` `decrease-label` and `increase-label`.
- Do not use it to show progress.

## Examples

**Recommended case:** brightness, with `text` on, outside a field.

**Alternative cases:** a price range, `mode="range"` with `inputs`, `start-label` and
`end-label`; a volume, `orientation="vertical"` with `limits`.

## Anti-patterns

- **Do not use it to show progress** — use a progress bar.
- **Do not show the error only through the thumb color** — use `nph-field`, which gives the
  message.
- **Do not replace the balloon with a fixed text above the thumb** — use `text`.
- **Do not turn on `text` inside `nph-field`** — the label comes out twice.
- **Do not turn on `limits` together with `marks`** — the marks already show the ends.
- **Do not use `marks` on a continuous scale** — use `limits`.
- **Do not use `vertical` in a common form** — the horizontal one follows the reading.
- **Invalid combinations:** an `orientation` or a `mode` outside its values; `min` not below
  `max`; a `step` that is not a positive number; `marks`, `inputs` or `steppers` in the
  vertical orientation; `marks` on a scale of more than 100 steps; `steppers` without its two names; `invalid` without the sentence in
  `nph-field`.
- **Do not create without a decision:** a size property, more than two thumbs, a unit or a
  custom number format, a color property or an event of its own.

## Sources and decisions

- **The repository `design.md`:** `color/input`, `color/primary`, `color/primary-border`,
  `status/error`, `focus/*`, `state/disabled-opacity`, `icon/size-sm`, `control/height-large`,
  `layout/input-width`, `space/*`, `text/label-md` and `text/caption`.
- **The decision that originated it:** P94, the API and semantics of `nph-slider`; the form
  pattern is P80 and the field contract is P83. D1 to D5 of P94 — the order of the parts beside
  the track, the thumb that minus and plus move in `range`, the vertical length, one mark per
  step and the width of the field — are defaults of this implementation, provisional until
  Indiane answers them.
- **Tests:** `src/components/nph-slider/nph-slider.test.ts`.
- **Usage evidence:** the Examples section of the `nph-slider` Docs page.
- **Storybook:** `src/components/nph-slider/nph-slider.stories.ts` (Validation) and
  `nph-slider.docs.stories.ts` (Docs).
- **Figma:** board `nph-slider` (`1636:46`), frame `1925:642` and set `1636:44` in
  `DS-IA-NEPHOS 5.0`.
