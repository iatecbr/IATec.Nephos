---
piece: nph-input
level: component
status: active
solves: >-
  Gives the person a one-line field to type or edit a value, such as a name, an
  email or a search, and takes part in the form that contains it.
use_when:
  - "When the person needs to type or edit a one-line value."
  - "Inside an nph-field when the field needs a label, help or an error message."
  - "With a start or end icon turned on by the property, without creating a variant."
  - "default in general use; large on the screen that needs the 44 px target, for every field of the form and the button next to them."
do_not_use_when:
  - "For multi-line text: the field holds one line."
  - "For a password, a number or a masked value: they are out of v1 and get their own task."
  - "To show the error message or the help: they belong to nph-field."
  - "To name the field with the placeholder alone: it disappears when the person types."
  - "To show a value that cannot be edited: there is no read-only state."
api:
  type:
    type: enum
    values: [text, email, tel, url, search]
    required: false
    default: text
    reflects: false
    constraint: >-
      The type of the inner native field (D1). Password, number and mask are out
      of v1. Any other value draws nothing and emits console.error in development.
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      Only the height changes: control/height-default or control/height-large.
      Reflects because the internal CSS selects the height by it. One size per
      form, the same as the button next to the field.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The current value. The value attribute is the initial value and the value
      of form.reset(), as in the native input: it applies only while the person
      has not edited the field and setting the property has not made it dirty.
      Setting it from code fires no event.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The example before typing, already localized. It is not a name: it
      disappears when the person types.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entry in the form data. Reflects because the form reads the
      attribute of the host: without it, the value is left out of the submission.
  autocomplete:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The purpose of the value for autofill, such as email or tel, passed to the
      inner field (WCAG 1.3.5).
  required:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The native required of the inner field: announced by the screen reader and
      checked by the form, with the message of the browser. A form whose messages
      are written by nph-field uses novalidate when the browser balloon is not
      wanted.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity, on color/muted, out of the Tab
      order and of the form data. A disabled fieldset disables it too. It wins
      over invalid.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error state: the border becomes status/error and the inner field gets
      aria-invalid. It is not a constraint of the form. The sentence belongs to
      nph-field; never invalid without it.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name in text, never visible, for a field with no associated
      label, such as a search on its own; nph-field writes it. An associated label
      (nph-label for, or a label element) wins over it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error
      sentence that nph-field writes. It is read when the field takes focus.
  icon-start:
    type: string
    required: false
    default: none
    reflects: false
    constraint: >-
      none or a core name of nph-icon, light, at icon/size-sm, before the value.
      Decorative. Any other value draws nothing and emits console.error in
      development.
  icon-end:
    type: string
    required: false
    default: none
    reflects: false
    constraint: >-
      none or a core name of nph-icon: it turns on the end button, which always
      clears the value; the name only swaps the art, xmark in Figma. The button
      shows only when there is a value and the field is enabled.
  clear-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the clear button, already localized. Required with
      icon-end: without it, the field renders without the button and emits
      console.error in development.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event, when the person types or clears. It bubbles and
      crosses the shadow root. Read the value from the host.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native change event, fired again by the host when the person commits a
      value or clears it. It bubbles. Setting value from code fires neither event.
variants:
  size:
    axis: size
    choose_when: "default in general use; large on the screen that needs the 44 px target for the accessibility of its users. One size per form, the same as the button next to the field."
    do_not_combine_with:
      - "default and large fields in the same form."
  icons:
    axis: appearance
    choose_when: "A start icon when it says what the field takes, such as magnifying-glass in a search. The end icon when the person will often clear the value."
    do_not_combine_with: []
states:
  default:
    token: color/input
    changes_for_user: "The resting border, on color/background."
  hover:
    token: color/input-hover
    changes_for_user: "The border goes one step darker under the pointer."
  focus:
    token: focus/border
    changes_for_user: "The border takes focus/border with the focus/halo attached outside, at focus/radius-control and focus/ring-width."
  focus-clear:
    token: focus/border
    changes_for_user: "Keyboard focus on the clear button: the container keeps color/input, and the border and the halo sit around the 24 by 24 target."
  error:
    token: status/error
    changes_for_user: "The border is status/error, also on hover; the sentence is in nph-field."
  error-focus:
    token: focus/halo-error
    changes_for_user: "The border stays status/error and the halo is focus/halo-error."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece at state/disabled-opacity on color/muted, with the color/input border; it does not respond and wins over the error."
business_rules:
  - "The end icon always clears the value; swapping the icon changes only the art."
  - "The clear button shows only when there is a value; after clearing, the focus goes back to the field."
  - "Typing and clearing fire the native input and change; setting value from code fires nothing."
  - "Enter submits the form, through its default button, as a native field does."
  - "disabled wins over invalid: no error look on a field the person cannot edit."
domain_errors:
  - "invalid: the value needs correction; nph-field writes the sentence and passes it as description."
tokens:
  height: "control/height-default or control/height-large"
  width: layout/input-width
  radius: radius/control
  border: "border/width, in color/input, color/input-hover, focus/border or status/error"
  background: "color/background; color/muted when disabled"
  padding: space/control-padding
  gap: space/inline
  value: "text/body-md in color/foreground"
  placeholder: "text/body-md in color/muted-foreground"
  icons: "icon/size-sm in color/muted-foreground"
  clear_target: "icon/size-sm with space/inline-tight around it"
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width, focus/radius-control, focus/border-radius-control and focus/radius-control-with-border"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-input for a one-line value; for multi-line text, a password, a number or a mask, nph-input is not the piece."
  - "Put nph-input inside nph-field when the field needs a label, help or an error message; on its own, give it a name with nph-label for or label."
  - "Never use the placeholder as the only name."
  - "To show an error, set the error of nph-field; do not set invalid on the input alone."
  - "Read the value from the host on input or change; do not listen for an nph-* event."
  - "Use icon-end with clear-label only when the person will often clear the value."
  - "Use the same size for every field and the button of one form."
accessibility:
  semantics: "The native input inside the shadow root, of the chosen type. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host: nph-label for, or a label element, referenced by the inner field. Without one, from label. The placeholder is not a name. With no name at all, the field renders and warns in development."
  keyboard:
    - "Tab enters the field and, when there is a value, the clear button."
    - "Enter in the field submits the form."
    - "Enter or Space on the clear button clears the value and brings the focus back to the field."
  focus: "The field shows the focus border and the halo whenever it has the focus, by pointer or keyboard; the clear button shows its own only for the keyboard."
  contrast: "The color/input border meets 3:1 against the background (WCAG 1.4.11); the halo is decoration."
  color_alternative: "The error is said by the sentence of nph-field, read as the description of the field; the border color is not the only signal."
invalid_combinations:
  - "A type outside text, email, tel, url and search — the field draws nothing."
  - "A size outside default and large — the field draws nothing."
  - "An icon value outside none and the core names — the field draws nothing."
  - "icon-end without clear-label — the field renders without the clear button."
  - "invalid without the sentence in nph-field — red with no text."
relations:
  combines_with: [nph-field, nph-label, nph-icon, nph-button]
  parents: [nph-field, "form"]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Painting the regular field with color/muted: it is the disabled background."
  - "Using the halo alone with the gray border: the border is what meets 3:1."
  - "Putting the error message inside the field."
  - "Using the placeholder as the only label."
  - "Using it for multi-line text."
  - "Mixing default and large in one form."
sources:
  design_md: "design.md, color/input, color/input-hover, status/error, focus/*, state/disabled-opacity, control/height-*, layout/input-width, text/body-md and rule 6"
  decision: "P80 — API and semantics of nph-input, the reference of the form controls"
  tests: "src/components/nph-input/nph-input.test.ts"
  usage_evidence: "the Examples section of the nph-icon Docs page"
  storybook: "src/components/nph-input/nph-input.stories.ts and nph-input.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-input frame 1195:532 and set 622:18359"
---

# nph-input

## Function

**The problem it solves:** gives the person a one-line field to type or edit a value, such
as a name, an email or a search, and takes part in the form that contains it. The label,
the help and the error message belong to `nph-field`; the input shows only the `erro` state.

**When to use:**

- When the person needs to type or edit a one-line value.
- Inside an `nph-field` when the field needs a label, help or an error message.
- With a start or end icon turned on by the property, without creating a variant.
- `default` in general use; `large` on the screen that needs the 44 px target, for every
  field of the form and the button next to them.

**When NOT to use:**

- **For multi-line text** — the field holds one line.
- **For a password, a number or a masked value** — they are out of v1 and get their own task.
- **To show the error message or the help** — they belong to `nph-field`.
- **To name the field with the placeholder alone** — it disappears when the person types.
- **To show a value that cannot be edited** — there is no read-only state.

## Variants

**By appearance:** the start icon and the end icon, each turned on by a property; they do
not create a variant.

**By size:** `default` (`control/height-default`) and `large` (`control/height-large`). Only
the height changes.

**By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| `default` | General use |
| `large` | The screen needs the 44 px target for the accessibility of its users |
| Start icon | It says what the field takes, such as `magnifying-glass` in a search |
| End icon | The person will often clear the value |

**Do not combine with:** `default` and `large` fields in the same form.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/input` | The resting border, on `color/background` |
| `hover` | `color/input-hover` | The border goes one step darker under the pointer |
| `foco` | `focus/border`, `focus/halo` | The border takes `focus/border`, with the halo attached outside at `focus/radius-control` |
| `foco-limpar` | `focus/border`, `focus/halo` | The container keeps `color/input`; the border at `focus/border-radius-control` and the halo at `focus/radius-control-with-border` sit around the 24 × 24 clear target |
| `erro` | `status/error` | The border is `status/error`, also on hover |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error` |
| `disabled` | `state/disabled-opacity`, `color/muted` | The whole piece at `state/disabled-opacity` on `color/muted`, with the `color/input` border |

**Feedback and focus:** `disabled` wins over everything; `erro` keeps its border on hover and
on focus; with `erro` and the focus on the clear button, the container is `status/error` and
the target takes the usual focus. The field shows its focus whenever it has it; the clear
button shows its own only for the keyboard.

**Business rule the piece carries:**

- The end icon always clears the value; swapping the icon changes only the art.
- The clear button shows only when there is a value; after clearing, the focus goes back to
  the field.
- Typing and clearing fire the native `input` and `change`; setting `value` from code fires
  nothing.
- Enter submits the form, through its default button, as a native field does.
- `disabled` wins over `invalid`.

**Domain error states:** `invalid`, when the value needs correction. `nph-field` writes the
sentence and passes it to the input as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The native `input` inside the shadow root, of the chosen type. The host is form-associated and labelable: `host.labels`, `host.form` and the validity work as in a native field |
| Accessible name | From the label associated with the host — `nph-label for`, or a `label` element —, which the inner field references. Without one, from `label`. The placeholder is not a name. With no name at all, the field renders and warns in development |
| Description | `description`, read when the field takes focus: the help or the error sentence of `nph-field` |
| Keyboard | Tab enters the field and, when there is a value, the clear button. Enter in the field submits the form. Enter or Space on the clear button clears the value and brings the focus back |
| Focus | The border takes `focus/border` with the halo outside, without changing the size |
| Contrast | The `color/input` border meets 3:1 against the background (WCAG 1.4.11); the halo is decoration |
| Alternative to color | The error is said by the sentence of `nph-field`, read as the description; the border color is not the only signal |
| Touch target | The field itself; `large` guarantees 44 px. The clear button has its own 24 × 24 target |
| Known limits | Forced colors and right-to-left are not treated yet. Autofill by browsers and password managers inside a shadow root varies |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help and the error; `nph-label`,
which names it on its own with `for`; `nph-icon`, through the start and end icons; and
`nph-button`, side by side in the same size.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-icon`, in the start icon and in the clear button.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container | Height `control/height-default` or `control/height-large`; width `layout/input-width`; radius `radius/control`; border `border/width`; side padding `space/control-padding`; gap `space/inline`; background `color/background` |
| Value | `text/body-md`, `color/foreground` |
| Placeholder | `text/body-md`, `color/muted-foreground` |
| Start and end icons | `icon/size-sm`, `color/muted-foreground` |
| Clear target | 24 × 24: `icon/size-sm` with `space/inline-tight` around it, no radius of its own |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width`, `focus/radius-control`, `focus/border-radius-control`, `focus/radius-control-with-border` |
| Disabled | `state/disabled-opacity` on `color/muted` |

**Usage restrictions:** `color/muted` is only the disabled background. The width may stretch
to the parent, with no minimum. There is no motion.

**AI hints:**

- Use `nph-input` for a one-line value; for multi-line text, a password, a number or a mask,
  `nph-input` is not the piece.
- Put `nph-input` inside `nph-field` when the field needs a label, help or an error message;
  on its own, give it a name with `nph-label for` or `label`.
- Never use the placeholder as the only name.
- To show an error, set the error of `nph-field`; do not set `invalid` on the input alone.
- Read the value from the host on `input` or `change`; do not listen for an `nph-*` event.
- Use `icon-end` with `clear-label` only when the person will often clear the value.
- Use the same size for every field and the button of one form.

## Examples

**Recommended case:** inside an `nph-field`, which gives the label, the help and the error,
with `name` and `autocomplete` for the form.

**Alternative case:** a search on its own, with `icon-start="magnifying-glass"`, `icon-end="xmark"`,
`clear-label` and `label` as the name.

## Anti-patterns

- **Do not paint the regular field with `color/muted`** — it is the disabled background.
- **Do not use the halo alone with the gray border** — the border is what meets 3:1.
- **Do not put the error message inside the field** — it belongs to `nph-field`.
- **Do not use the placeholder as the only label** — it disappears when the person types.
- **Do not use it for multi-line text.**
- **Do not mix `default` and `large` in one form.**
- **Invalid combinations:** a `type` outside the five; a `size` outside the two; an icon
  value outside `none` and the core; `icon-end` without `clear-label`; `invalid` without the
  sentence in `nph-field`.
- **Do not create without a decision:** a password, number or mask type, a read-only state,
  `maxlength`, `pattern`, `inputmode`, a color property, motion or an event of its own.

## Sources and decisions

- **The repository `design.md`:** `color/input`, `color/input-hover`, `status/error`,
  `focus/*`, `state/disabled-opacity`, `control/height-*`, `layout/input-width`,
  `text/body-md` and rule 6.
- **The decision that originated it:** P80, the API and semantics of `nph-input`, the
  reference of the form controls; the field contract is P83.
- **Tests:** `src/components/nph-input/nph-input.test.ts`.
- **Usage evidence:** the Examples section of the `nph-icon` Docs page.
- **Storybook:** `src/components/nph-input/nph-input.stories.ts` (Validation) and
  `nph-input.docs.stories.ts` (Docs).
- **Figma:** `nph-input` frame (`1195:532`) and set `622:18359` in `DS-IA-NEPHOS 5.0`.
