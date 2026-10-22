---
piece: nph-field
level: component
status: active
solves: >-
  Composes the label, the control, the help text and the error message of a form
  field, and carries the error state. It names and describes the control it wraps,
  or names the group of radios or checkboxes it wraps.
use_when:
  - "When a control needs a name, a required mark, an explanation or an error message."
  - "To name a group of radios or checkboxes, such as Payment method, and carry its error message."
  - "required when filling in the field is required."
  - "help when the expected value needs an explanation."
  - "error only with the sentence that says what to fix."
do_not_use_when:
  - "For a control that already brings its own visible name, such as nph-checkbox alone."
  - "To show an error on a disabled field: whoever cannot edit cannot fix."
  - "To leave the field red without a text that explains."
  - "With a loose nph-label inside the field, besides its label."
  - "With the placeholder of the control in place of the label: it disappears when the person types."
  - "As a box to gain space between blocks."
api:
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The label text, already localized by the consuming application, drawn by an
      nph-label. It is also the accessible name of the control: the field writes it
      on the control, or names the group with it. Empty, the field renders anyway and
      emits console.error in development.
  required:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma obrigatório. Shows the asterisk on the label and writes required on
      the control, which announces it. In a group of radios, the group carries
      aria-required; a group of checkboxes or switches has only the asterisk.
  info:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma ícone. The text of the explanation, passed to the nph-label, which
      draws the information icon and opens the nph-tooltip with it. It never repeats
      the help text.
  info-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the information icon, such as More information about
      Email, passed to the nph-label. The property is infoLabel. Without it the icon
      does not show.
  help:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma mostrar apoio and texto de apoio. The help line, in text/caption.
      Empty, it is not drawn. It leaves the line while the error shows.
  error:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma mensagem de erro. Filling it in is what makes the field invalid:
      there is no state property. The message replaces the help, in text/body-md and
      status/error, with no icon, and the field writes invalid on the control. A
      disabled field hides it.
  counter:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The Figma contador and texto do contador. The counter text, shown as it comes,
      such as 12/500: at the end of the help line, or on a line of its own below the
      error. The field counts nothing, and the counter is not part of the
      description of the control.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Written on the control, which fades itself with state/disabled-opacity; the
      field draws no opacity, and the label and the message line never fade. Disabled
      wins over error. When the field is enabled again, it gives back only the
      disabled it turned on.
  slot:
    type: "default slot"
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The Figma ⮑ controle. One control, such as nph-input, or the options of a group
      of checkboxes, radios or switches. An option declares itself with the static
      nphFieldRole of its class, option or radio; anything else is a control.
variants:
  error:
    axis: state
    choose_when: "The Figma state erro: when the value needs correction, always with the message filled in. In code, it is the presence of error."
    do_not_combine_with: ["disabled"]
  required:
    axis: appearance
    choose_when: "The Figma obrigatório: when filling in the field is required."
    do_not_combine_with: []
  info:
    axis: appearance
    choose_when: "The Figma ícone: when the field needs a short explanation that does not fit in the label or in the help; in code, info with info-label."
    do_not_combine_with: []
states:
  default:
    token: "space/stack-tight between the label row, the control and the message line"
    changes_for_user: "The label, the control and, when filled in, the help line. With no help, no error and no counter, the message line is not drawn and keeps no height."
  error:
    token: "text/body-md and status/error on the message"
    changes_for_user: "The error message replaces the help and the control shows its error state. The label does not change."
  disabled:
    token: "state/disabled-opacity, drawn by the control"
    changes_for_user: "The control fades and does not respond. The error is hidden and the help comes back; the label and the message line do not fade."
business_rules:
  - "Filling in the error message is what makes the field invalid; there is no error state without the sentence."
  - "The help text leaves the line while the error shows: write the rule in the error message too."
  - "Disabled wins over error: a disabled field shows no error, because whoever cannot edit cannot fix."
  - "Inside a field, the field is the source of label, description, invalid and required of its control; a value set on the control is overwritten."
domain_errors:
  - "error: the value needs correction; the message says what to fix."
tokens:
  width: layout/field-width
  stack_gap: space/stack-tight
  option_gap: space/stack-tight
  label_to_icon: "space/inline-tight, from the nph-label"
  help: [text/caption, color/muted-foreground]
  error: [text/body-md, status/error]
  counter: [text/caption, color/muted-foreground]
  counter_gap: space/inline
  disabled: "state/disabled-opacity, drawn by the control"
ai_hints:
  - "Give the control its name with the label of nph-field; do not add a loose nph-label or an aria-label on the control."
  - "Write error to put the field in error: there is no state property and no invalid on the field."
  - "Set required, disabled and error on the field, not on the control: the field writes them on the control."
  - "In a group of radios or checkboxes, put the options in the slot of one nph-field: it names the group and carries the message."
  - "Do not wrap nph-checkbox alone in nph-field to give it a name: its text already is."
  - "The counter text comes ready from the application; the field does not count characters."
accessibility:
  semantics: "The label is an nph-label without for. A control is named and described by properties the field writes on it, because an id does not cross a shadow root. In a group, the slot is wrapped in a group, or a radiogroup for radios, inside the shadow root of the field."
  accessible_name: "The label of nph-field is the only name of the control: the field writes it as label, and the control puts it on its focusable element. A group is named by the label through aria-label."
  keyboard:
    - "Tab reaches the information icon of the label, when it exists, and then the control."
    - "The keyboard of the control is the control's own."
  focus: "The field takes no focus. The focus shows on the wrapped control; a click on the label text moves the focus to the control. In a group, a click on the label moves no focus."
  contrast: "The label uses color/foreground, 21:1 in light and 14.73:1 in dark; the control border is color/input, which meets 3:1."
  color_alternative: "The error state always brings the written message; the field is never only red."
invalid_combinations:
  - "No label — the control has no name; the field renders and emits console.error in development."
  - "error on a disabled field — disabled wins and the error is hidden."
  - "No control in the slot, more than one control, a control mixed with options, radios mixed with checkboxes or switches, or an element that does not take the field contract — the field renders and warns in development."
relations:
  combines_with: [nph-label, nph-tooltip, nph-input, nph-checkbox, nph-radio, nph-switch]
  parents: ["form"]
  children: [nph-label]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Leaving the field red without a text that explains."
  - "Showing an error on a disabled field."
  - "Putting a loose nph-label inside the field, besides its label."
  - "Using the placeholder of the control in place of the label."
  - "Wrapping a control that already has its own visible name, such as nph-checkbox alone."
  - "Using the field as a box to gain space between blocks."
  - "Setting invalid, required or the accessible name on the control inside a field."
sources:
  design_md: "design.md, layout/field-width, space/stack-tight, space/inline-tight, space/inline, text/caption, text/body-md, color/muted-foreground, status/error and state/disabled-opacity"
  decision: "P83 — nph-field: API, semantics and the field–control contract"
  tests: "src/components/nph-field/nph-field.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-field/nph-field.stories.ts and nph-field.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Field, nph-field frame 1194:21863 and set 657:50"
---

# nph-field

## Function

**The problem it solves:** composes the label, the control, the help text and the error
message of a form field, and carries the error state. It names and describes the control it
wraps, or names the group of radios or checkboxes it wraps. Filling in the error message is
what makes the field invalid.

**When to use:**

- When a control needs a name, a required mark, an explanation or an error message.
- To name a group of radios or checkboxes, such as Payment method, and carry its error
  message.
- `required` when filling in the field is required.
- `help` when the expected value needs an explanation.
- `error` only with the sentence that says what to fix.

**When NOT to use:**

- **For a control that already brings its own visible name** — such as `nph-checkbox` alone.
- **To show an error on a disabled field** — whoever cannot edit cannot fix.
- **To leave the field red without a text that explains.**
- **With a loose `nph-label` inside the field** — besides its label.
- **With the placeholder of the control in place of the label** — it disappears when the
  person types.
- **As a box to gain space between blocks.**

## Variants

**By appearance:** the Figma set has three variant axes — `state` (`default` or `erro`),
`obrigatório` and `ícone` — and the properties `mostrar apoio`, `texto de apoio`,
`mensagem de erro`, `contador`, `texto do contador` and `⮑ controle`. In code, a text
that is filled in turns its part on: there are no booleans to show a part, and no `state`
property.

| Figma | Code |
|---|---|
| `state` `erro` | `error` filled in |
| `obrigatório` | `required` |
| `ícone` | `info` with `info-label` |
| `mostrar apoio`, `texto de apoio` | `help` |
| `mensagem de erro` | `error` |
| `contador`, `texto do contador` | `counter` |
| `⮑ controle` | the default slot |

**By size:** `not_applicable`. The size is the control's own.

**By density:** `not_applicable`.

**Do not combine with:** an error on a disabled field.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `space/stack-tight` | The label, the control and, when filled in, the help line. With no help, no error and no counter, the message line is not drawn and keeps no height |
| Error | `text/body-md`, `status/error` | The error message replaces the help and the control shows its error state. The label does not change |
| Disabled | `state/disabled-opacity`, drawn by the control | The control fades and does not respond. The error is hidden and the help comes back |

**The counter** sits at the end of the help line, at least `space/inline` from the help
text; alone, at the end of the line; in error, on a line of its own below the message, at
the end, `space/stack-tight` below it. It never takes the error color.

**A group of options** — radios, checkboxes or switches — is stacked at `space/stack-tight`.
Each option keeps its own text as its name; the field names the group and carries its error
message.

**Business rule the field carries:**

- Filling in the error message is what makes the field invalid.
- The help text leaves the line while the error shows: write the rule in the error message
  too.
- Disabled wins over error.
- Inside a field, the field is the source of `label`, `description`, `invalid` and
  `required` of its control.

**Domain error states:** `error`, the value needs correction; the message says what to fix.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The label is an `nph-label` without `for`. A control is named and described by properties the field writes on it, because an id does not cross a shadow root. In a group, the slot is wrapped in a `group`, or a `radiogroup` for radios, inside the shadow root of the field |
| Accessible name | The label of `nph-field` is the only name of the control: the field writes it as `label`, and the control puts it on its focusable element. A group is named by the label |
| Description | The visible message line, help or error, is the description: the field writes it as `description` on a control, and points the group to it with `aria-describedby`. The counter is not part of it |
| State | The field writes `invalid` and `required` on a control. A group carries `aria-invalid`; a group of radios also carries `aria-required` |
| Keyboard | Tab reaches the information icon of the label, when it exists, and then the control. The keyboard of the control is its own |
| Focus | The field takes no focus. The focus shows on the wrapped control; a click on the label text moves the focus to it. In a group, a click on the label moves no focus |
| Contrast | The label uses `color/foreground`, 21:1 in light and 14.73:1 in dark; the control border is `color/input`, which meets 3:1 |
| Alternative to color | The error state always brings the written message; the field is never only red |

### The field–control contract (P83)

A control that enters the field takes these properties, which the field writes and the
control applies to its focusable element, in its own root:

| Property | On a control | On an option of a group |
|---|---|---|
| `label` | The accessible name, never visible | Not written |
| `description` | The accessible description: an inner element hidden by clipping, never by `display: none`, referenced by `aria-describedby` | Not written: the group is described |
| `invalid` | The error state and `aria-invalid` | Written on every option |
| `required` | Announced by the control | Not written: a radio group carries `aria-required` |
| `disabled` | The control fades itself; the field draws nothing | Written on every option |

An option declares itself with `static nphFieldRole`: `'option'` for a checkbox or a switch,
`'radio'` for a radio. A control needs no declaration. `focus()` on the host of a control
moves the focus to its focusable element.

## Relations

**Combines with:** `nph-label`, its label, and `nph-tooltip`, through the information icon of
the label. Its default control is `nph-input`; it also names groups of `nph-checkbox`,
`nph-radio` and `nph-switch`.

**What is the parent:** a form.

**What is the child:** `nph-label`, in its shadow root, and the control or the options, in
the default slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Field | Width `layout/field-width`; it may stretch to its container. `space/stack-tight` between the label row, the control and the message line |
| Label row | `space/inline-tight` between the label and the information icon, from the `nph-label` |
| Control | Fills the width of the field |
| Options of a group | `space/stack-tight` between them |
| Help text | `text/caption`, `color/muted-foreground` |
| Error message | `text/body-md`, `status/error`, no icon |
| Counter | `text/caption`, `color/muted-foreground`; `space/inline` from the help text |
| Disabled | `state/disabled-opacity`, drawn by the control |

**Usage restrictions:** the field has no background, border or focus of its own and draws
no opacity. The `use` of `space/stack-tight` in `design.md` names a label and the field it
describes, and the `use` of `status/error` names the border of an invalid field.

**AI hints:**

- Give the control its name with the label of `nph-field`; do not add a loose `nph-label` or
  an `aria-label` on the control.
- Write `error` to put the field in error: there is no `state` property and no `invalid` on
  the field.
- Set `required`, `disabled` and `error` on the field, not on the control.
- In a group of radios or checkboxes, put the options in the slot of one `nph-field`.
- Do not wrap `nph-checkbox` alone in `nph-field` to give it a name.
- The counter text comes ready from the application; the field does not count characters.

## Examples

**Recommended case:** a required field, filled in, with the asterisk on the label; an email
field in error, with the sentence that says what to fix; and a field with the information
icon and the help text.

**Alternative case:** a group of radios named "Payment method", required, with the error
message below the options.

## Anti-patterns

- **Do not leave the field red without a text that explains.**
- **Do not show an error on a disabled field.**
- **Do not put a loose `nph-label` inside the field**, besides its label.
- **Do not use the placeholder of the control in place of the label.**
- **Do not wrap a control that already has its own visible name**, such as `nph-checkbox`
  alone.
- **Do not use the field as a box to gain space between blocks.**
- **Do not set `invalid`, `required` or the accessible name on the control** inside a field:
  the field overwrites them.
- **Invalid combinations:** no label; an error on a disabled field; no control, more than
  one control, a control mixed with options, radios mixed with checkboxes or switches, or an
  element that does not take the field contract.
- **Do not create without a decision:** a `state` property, a boolean to show a part, a
  size, a color property, an orientation for the group or a form association.

## Sources and decisions

- **The repository `design.md`:** `layout/field-width`, `space/stack-tight`,
  `space/inline-tight`, `space/inline`, `text/caption`, `text/body-md`,
  `color/muted-foreground`, `status/error` and `state/disabled-opacity`.
- **The decision that originated it:** P83 — `nph-field`: API, semantics and the
  field–control contract.
- **Tests:** `src/components/nph-field/nph-field.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-field/nph-field.stories.ts` (Validation) and
  `nph-field.docs.stories.ts` (Docs).
- **Figma:** `nph-field` frame (`1194:21863`) and set `657:50` in `DS-IA-NEPHOS 5.0`, page
  `NPH — Field`.
