---
piece: nph-textarea
level: component
status: active
solves: >-
  Gives the person a multi-line field to write a long text, such as a comment, a
  message or a description, that grows with the text up to a maximum and takes part
  in the form that contains it.
use_when:
  - "When the person writes more than one line, such as a comment, a message or a description."
  - "Inside an nph-field when the field needs a label, help, an error message or a support-line counter."
  - "With the footer, counter and actions, only in a comment or a message, where the actions stay next to the text."
  - "With readonly to show a long text the person reads and copies, but does not edit."
do_not_use_when:
  - "For a one-line value: use nph-input."
  - "To pick among ready options: use nph-select or nph-combobox."
  - "To show the error message or the help: they belong to nph-field."
  - "To put a footer counter in a common form: use the counter of nph-field."
  - "To turn the footer on in readonly: there is nothing to send."
  - "To block typing at a limit: the counter warns, and the error state says the limit was passed."
api:
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The current value, with its line breaks. The value attribute is the initial
      value and the value of form.reset(), as in the native textarea: it applies
      only while the person has not edited the field and setting the property has
      not made it dirty. Setting it from code fires no event.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The invitation before writing, already localized. It is not a name: it
      disappears when the person writes.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entry in the form data. Reflects because the form reads the
      attribute of the host: without it, the value is left out of the submission.
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
      order and of the form data, and the footer actions disabled; the piece gives
      back only the disabled it turned on. A disabled fieldset disables it too. It
      wins over readonly and invalid.
  readonly:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma leitura (property readOnly). The person reads, selects and copies
      the text, and does not edit it; the field stays focusable, in the form data
      and out of validation, as the native one. No hover, no error look and no
      footer: with a counter or an action, the footer is not drawn and
      console.warn says why in development.
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
      label, such as a comment box; nph-field writes it. An associated label
      (nph-label for, or a label element) wins over it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error
      sentence that nph-field writes. It is read when the field takes focus.
  counter:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The footer counter text, shown as it comes, such as 0/280, already
      localized. The piece counts nothing and has no maxlength: the consumer
      writes it on input, and a limit warns without blocking typing. A text that
      is empty or only spaces turns the counter off. It is not part of the
      accessible description.
  actions:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The footer actions, nph-button instances of the consumer: ghost, such as
      Attach, and solid, such as Send, in size=default. An element in the slot
      turns the footer on. There is no other slot.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event, when the person writes. It bubbles and crosses the
      shadow root. Read the value from the host.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native change event, fired again by the host when the person commits a
      value. It bubbles. Setting value from code fires neither event.
variants:
  footer:
    axis: appearance
    choose_when: "The footer, with counter and actions, only in a comment or a message, where the actions stay next to the text. In a common form, the counter goes in the support line of nph-field."
    do_not_combine_with:
      - "readonly: there is nothing to send."
      - "A counter in the footer and another in the nph-field support line."
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
  error:
    token: status/error
    changes_for_user: "The border is status/error, also on hover; the sentence is in nph-field."
  error-focus:
    token: focus/halo-error
    changes_for_user: "The border stays status/error and the halo is focus/halo-error."
  readonly:
    token: color/input
    changes_for_user: "The resting border, also on hover, with no error look and no footer; the focus stays visible."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece at state/disabled-opacity on color/muted, with the color/input border and the actions disabled; it does not respond and wins over readonly and the error."
business_rules:
  - "The field grows with the text from layout/textarea-min-height and stops at layout/textarea-max-height; above it, the text scrolls inside. There is no resize handle."
  - "Enter writes a new line; it does not submit the form."
  - "The footer shows when there is a counter or an action, and never in readonly."
  - "The piece counts nothing: the consumer writes the counter text on input, and a limit warns without blocking typing."
  - "Writing fires the native input and change; setting value from code fires nothing."
  - "disabled wins over readonly, and readonly wins over invalid."
domain_errors:
  - "invalid: the value needs correction, such as a passed limit; nph-field writes the sentence and passes it as description."
tokens:
  width: layout/input-width
  height: "layout/textarea-min-height to layout/textarea-max-height, on the scroll area"
  radius: radius/control
  border: "border/width, in color/input, color/input-hover, focus/border or status/error"
  background: "color/background; color/muted when disabled"
  padding: "space/control-padding on the sides, space/inline at the top and bottom (D-1)"
  value: "text/body-md in color/foreground"
  placeholder: "text/body-md in color/muted-foreground"
  footer: "space/stack below the text; space/inline between the actions"
  counter: "text/caption in color/muted-foreground"
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width and focus/radius-control"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-textarea for a text of more than one line; for a one-line value, use nph-input."
  - "Put nph-textarea inside nph-field when the field needs a label, help, an error message or a counter; on its own, give it a name with nph-label for or label."
  - "Turn the footer on only in a comment or a message; in a common form, use the counter of nph-field."
  - "Write the counter on input yourself; do not expect the piece to count or to stop typing at a limit."
  - "To say a limit was passed, set the error of nph-field; do not paint the counter."
  - "Never use the placeholder as the only name."
  - "Read the value from the host on input or change; do not listen for an nph-* event."
accessibility:
  semantics: "The native textarea inside the shadow root, a multi-line text box. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host: nph-label for, a label element or nph-field, referenced by the inner field. Without one, from label. The placeholder is not a name. With no name at all, the field renders and warns in development."
  keyboard:
    - "Tab enters the field and then the footer actions."
    - "Enter in the field writes a new line; it does not submit the form."
  focus: "The field shows the focus border and the halo whenever it has the focus, by pointer or keyboard, also in readonly (D-2)."
  contrast: "The color/input border meets 3:1 against the background (WCAG 1.4.11); the halo is decoration."
  color_alternative: "The error is said by the sentence of nph-field, read as the description of the field; the border color is not the only signal."
invalid_combinations:
  - "readonly with a counter or an action — the footer is not drawn, with one warning in development."
  - "invalid without the sentence in nph-field — red with no text."
  - "A footer counter inside an nph-field that also has a counter — two counters for one text."
relations:
  combines_with: [nph-field, nph-label, nph-button]
  parents: [nph-field, "form"]
  children: [nph-button]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Painting the counter in the error color: the error stays on the border and on the nph-field message."
  - "Turning the footer on in readonly."
  - "Using the footer counter in a common form."
  - "Blocking typing at the limit with maxlength."
  - "Painting the regular field with color/muted: it is the disabled background."
  - "Using it for a one-line value."
  - "Using the placeholder as the only label."
sources:
  design_md: "design.md, layout/textarea-min-height, layout/textarea-max-height, color/input, color/input-hover, status/error, focus/*, state/disabled-opacity, layout/input-width, text/body-md, text/caption and rule 6"
  decision: "P93 — API and semantics of nph-textarea, on the form shape of P80 and the field contract of P83"
  tests: "src/components/nph-textarea/nph-textarea.test.ts"
  usage_evidence: "the Examples section of the nph-textarea Docs page"
  storybook: "src/components/nph-textarea/nph-textarea.stories.ts and nph-textarea.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-textarea frame 1632:24, documentation 1922:642 and set 1632:22"
---

# nph-textarea

## Function

**The problem it solves:** gives the person a multi-line field to write a long text, such as
a comment, a message or a description, that grows with the text up to a maximum and takes
part in the form that contains it. The label, the help, the error message and the
support-line counter belong to `nph-field`; the textarea shows the `erro` state and, in a
comment or a message, a footer with a counter and actions.

**When to use:**

- When the person writes more than one line, such as a comment, a message or a description.
- Inside an `nph-field` when the field needs a label, help, an error message or a
  support-line counter.
- With the footer, counter and actions, only in a comment or a message, where the actions
  stay next to the text.
- With `readonly` to show a long text the person reads and copies, but does not edit.

**When NOT to use:**

- **For a one-line value** — use `nph-input`.
- **To pick among ready options** — use `nph-select` or `nph-combobox`.
- **To show the error message or the help** — they belong to `nph-field`.
- **To put a footer counter in a common form** — use the counter of `nph-field`.
- **To turn the footer on in `readonly`** — there is nothing to send.
- **To block typing at a limit** — the counter warns, and the error state says the limit was
  passed.

## Variants

**By appearance:** the footer, turned on by the content it holds — a `counter` or an element
in the `actions` slot. There is no `footer` property and no variant axis.

**By size:** `not_applicable`. The height comes from the text, between
`layout/textarea-min-height` and `layout/textarea-max-height`.

**By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| No footer | A common form, a description, a read-only text |
| Footer with counter and actions | A comment or a message, where the actions stay next to the text |

**Do not combine with:** the footer and `readonly`; a footer counter and the `nph-field`
counter for the same text.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/input` | The resting border, on `color/background` |
| `hover` | `color/input-hover` | The border goes one step darker under the pointer |
| `foco` | `focus/border`, `focus/halo` | The border takes `focus/border`, with the halo attached outside at `focus/radius-control` |
| `erro` | `status/error` | The border is `status/error`, also on hover |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error` |
| `leitura` (`readonly`) | `color/input` | The resting border, also on hover, with no error look and no footer; the focus stays visible |
| `disabled` | `state/disabled-opacity`, `color/muted` | The whole piece at `state/disabled-opacity` on `color/muted`, with the `color/input` border and the actions disabled |

**Feedback and focus:** `disabled` wins over everything; `readonly` wins over `invalid`;
`erro` keeps its border on hover and on focus. The field shows its focus whenever it has it,
also in `readonly` (D-2). The halo stays outside the clipping of the scroll area.

**Business rule the piece carries:**

- The field grows with the text from `layout/textarea-min-height` and stops at
  `layout/textarea-max-height`; above it, the text scrolls inside. There is no resize
  handle.
- Enter writes a new line; it does not submit the form.
- The footer shows when there is a counter or an action, and never in `readonly`.
- The piece counts nothing: the consumer writes the counter text on `input`, and a limit
  warns without blocking typing.
- Writing fires the native `input` and `change`; setting `value` from code fires nothing.
- `disabled` wins over `readonly`, and `readonly` wins over `invalid`.

**Domain error states:** `invalid`, when the value needs correction, such as a passed limit.
`nph-field` writes the sentence and passes it to the textarea as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The native `textarea` inside the shadow root, a multi-line text box. The host is form-associated and labelable: `host.labels`, `host.form` and the validity work as in a native field |
| Accessible name | From the label associated with the host — `nph-label for`, a `label` element or `nph-field` —, which the inner field references. Without one, from `label`. The placeholder is not a name. With no name at all, the field renders and warns in development |
| Description | `description`, read when the field takes focus: the help or the error sentence of `nph-field`. The footer counter is not part of it |
| Keyboard | Tab enters the field and then the footer actions. Enter writes a new line; it does not submit the form |
| Focus | The border takes `focus/border` with the halo outside, without changing the size, also in `readonly` |
| Contrast | The `color/input` border meets 3:1 against the background (WCAG 1.4.11); the halo is decoration |
| Alternative to color | The error is said by the sentence of `nph-field`, read as the description; the border color is not the only signal |
| Known limits | The growth uses `field-sizing: content`: a browser without it keeps the field at `layout/textarea-min-height`, scrolling inside. Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help, the error and the
support-line counter; `nph-label`, which names it on its own with `for`; and `nph-button`,
in the footer actions.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-button`, in the `actions` slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Box | Width `layout/input-width`; radius `radius/control`; border `border/width`; background `color/background` |
| Scroll area | From `layout/textarea-min-height` to `layout/textarea-max-height`; padding `space/control-padding` on the sides and `space/inline` at the top and bottom (D-1) |
| Value | `text/body-md`, `color/foreground` |
| Placeholder | `text/body-md`, `color/muted-foreground` |
| Footer | `space/stack` below the text, inside the box; counter at the start, actions at the end, `space/inline` apart (D-3) |
| Counter | `text/caption`, `color/muted-foreground` |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width`, `focus/radius-control` |
| Disabled | `state/disabled-opacity` on `color/muted` |

**Usage restrictions:** `layout/textarea-min-height` and `layout/textarea-max-height` serve
only this piece. `color/muted` is only the disabled background. The width may stretch to the
parent, with no minimum (D-4). There is no motion.

**AI hints:**

- Use `nph-textarea` for a text of more than one line; for a one-line value, use `nph-input`.
- Put `nph-textarea` inside `nph-field` when the field needs a label, help, an error message
  or a counter; on its own, give it a name with `nph-label for` or `label`.
- Turn the footer on only in a comment or a message; in a common form, use the counter of
  `nph-field`.
- Write the counter on `input` yourself; do not expect the piece to count or to stop typing
  at a limit.
- To say a limit was passed, set the error of `nph-field`; do not paint the counter.
- Never use the placeholder as the only name.
- Read the value from the host on `input` or `change`; do not listen for an `nph-*` event.

## Examples

**Recommended case:** inside an `nph-field`, which gives the label, the help, the error and
the support-line counter, with `name` for the form.

**Alternative case:** a comment on its own, with `label` as the name, a `counter` the
consumer updates on `input`, and two `nph-button` in the `actions` slot — `ghost` "Attach"
and `solid` "Send".

## Anti-patterns

- **Do not paint the counter in the error color** — the error stays on the border and on the
  `nph-field` message.
- **Do not turn the footer on in `readonly`** — there is nothing to send.
- **Do not use the footer counter in a common form** — use the counter of `nph-field`.
- **Do not block typing at the limit with `maxlength`** — the limit warns.
- **Do not paint the regular field with `color/muted`** — it is the disabled background.
- **Do not use it for a one-line value.**
- **Do not use the placeholder as the only label.**
- **Invalid combinations:** `readonly` with a counter or an action; `invalid` without the
  sentence in `nph-field`; a footer counter inside an `nph-field` that also has a counter.
- **Do not create without a decision:** a resize handle, `rows`, `maxlength`, a size, a color
  property, motion or an event of its own.

## Sources and decisions

- **The repository `design.md`:** `layout/textarea-min-height`, `layout/textarea-max-height`,
  `color/input`, `color/input-hover`, `status/error`, `focus/*`, `state/disabled-opacity`,
  `layout/input-width`, `text/body-md`, `text/caption` and rule 6.
- **The decision that originated it:** P93, the API and semantics of `nph-textarea`, on the
  form shape of P80 and the field contract of P83.
- **Tests:** `src/components/nph-textarea/nph-textarea.test.ts`.
- **Usage evidence:** the Examples section of the `nph-textarea` Docs page.
- **Storybook:** `src/components/nph-textarea/nph-textarea.stories.ts` (Validation) and
  `nph-textarea.docs.stories.ts` (Docs).
- **Figma:** `nph-textarea` frame (`1632:24`), documentation `1922:642` and set `1632:22` in
  `DS-IA-NEPHOS 5.0`.
