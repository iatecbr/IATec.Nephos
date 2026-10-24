---
piece: nph-input-otp
level: component
status: active
solves: >-
  Takes a short code of known length, sent by SMS or e-mail, with one cell per
  character, to confirm access.
use_when:
  - "To confirm access with a code sent by SMS or e-mail: length 6 or 4, by the length of the code."
  - "On a touch screen, where the code is usually typed on the phone: size large; on other screens, size default."
  - "When the code is typed in a public place: masked."
  - "For a code with letters and numbers, such as A7K2Q9: the field takes it and the cell does not change."
do_not_use_when:
  - "For free one-line text: use nph-input."
  - "Without nph-field: the label, the help and the error belong to nph-field."
  - "With cells of different sizes: use the same size in the whole field."
  - "To paint the resend action with a loose color: the resend is an nph-button below the field, with the label in color/link."
api:
  length:
    type: "number: 6 or 4"
    required: false
    default: 6
    reflects: true
    constraint: >-
      The number of cells, the Figma property of the set. Any other value draws nothing and emits
      console.error in development. A shorter length cuts the current value.
  size:
    type: "string: default or large"
    required: false
    default: default
    reflects: true
    constraint: >-
      default draws cells of control/height-default and large of
      control/height-large, for touch screens. The same in every cell. Any other value
      draws nothing and emits console.error in development.
  invalid:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The error state of the Figma set: every cell takes the border status/error and the inner
      input gets aria-invalid. The error sentence belongs to nph-field. disabled wins.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The disabled state of the Figma set: out of the Tab order, background color/muted and the
      whole field at state/disabled-opacity. A disabled fieldset does the same and
      takes the value out of the form data. It wins over invalid.
  masked:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The Figma cell property that hides the character, on the host because the cells are not public: every
      filled cell shows a dot in place of the character. The mask is visual only: the
      input stays a text input and a screen reader reads the code.
  required:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Announced as aria-required on the inner input. There is no constraint
      validation: the error sentence belongs to nph-field.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entry in the form data. It reflects, because the form reads the
      attribute of the host; without it, the field adds nothing to the form data.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The code: only ASCII letters and digits, up to length, with the case as typed.
      The value attribute is the initial value and the value of form reset; the
      property is the current value. A value set from code with other characters or
      longer than length is cleaned, cut and reported with console.warn in
      development. Setting it from code never fires an event.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name, as text, never shown. nph-field writes it. A label
      associated with the host names the field first; label is the name when there is
      none. With no name at all, the field renders and warns once in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description, as text: the help or the error sentence that
      nph-field writes. It goes into an inner element hidden by clipping, referenced
      by aria-describedby.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event of the inner input, which crosses the shadow root with the
      host as its target, once per change the person makes, with the value already
      cleaned. A dropped character fires nothing.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host, bubbling, when the person leaves the field or presses Enter
      with a value different from the one at focus.
variants:
  length:
    axis: content
    choose_when: "6 is the default. 4 for a four-character code."
    do_not_combine_with: []
  size:
    axis: size
    choose_when: "default (36 px) on most screens. large (44 px) on a touch screen, where the code is usually typed on the phone."
    do_not_combine_with:
      - "cells of different sizes in the same field."
  masked:
    axis: appearance
    choose_when: "Only when the code is typed in a public place; elsewhere seeing the character helps the person check it."
    do_not_combine_with: []
states:
  default:
    token: "color/input border, color/background background"
    changes_for_user: "The empty cells wait for the code."
  hover:
    token: color/input-hover
    changes_for_user: "Every cell border darkens while the pointer is over the field, which is one target. Error and disabled keep their border."
  focus:
    token: "focus/border and focus/halo, focus/ring-width wide"
    changes_for_user: "The cell where the next character goes, the active cell, takes the focus border and a halo outside it, out of the layout. With the code full, it is the last cell."
  error:
    token: status/error
    changes_for_user: "Every cell takes the error border; the sentence is written by nph-field."
  error_focus:
    token: "status/error and focus/halo-error"
    changes_for_user: "The active cell keeps the error border and the halo turns to the error tone."
  disabled:
    token: "color/muted and state/disabled-opacity"
    changes_for_user: "The field cannot be focused or edited and is drawn lighter, on the muted background."
business_rules:
  - "The field takes only ASCII letters and digits; any other character typed is dropped and fires nothing."
  - "A pasted code is cleaned and replaces the whole value, cut at length; a paste with no letter or digit changes nothing."
  - "Focus puts the caret on the next empty cell; a click on a cell puts the caret on it, or at the end of the code."
  - "Enter submits the form that owns the field, through its default button, or the form itself with none; a disabled default button stops it, and a consumer that cancels Enter keeps the form."
  - "Setting value from code never fires input or change."
  - "The value attribute is the initial value and the reset value; once the person or the code changes the value, a new value attribute does not replace it."
domain_errors:
  - "invalid: a wrong or expired code. Every cell shows the error border; nph-field writes the sentence and passes it as description."
tokens:
  gap: space/inline
  cell: "color/background background, color/input border at border/width, radius/control"
  cell_size: "control/height-default or control/height-large, as width and height"
  character: "text/code, color/foreground"
  dot: "text/code, color/foreground"
  hover: color/input-hover
  focus: "focus/border, focus/halo, focus/ring-width"
  error: "status/error, focus/halo-error"
  disabled: "color/muted, state/disabled-opacity"
ai_hints:
  - "Use nph-input-otp for a short code of known length sent by SMS or e-mail; for free text, use nph-input."
  - "Put it in an nph-field, which writes label, description, invalid and required."
  - "Set length to the length of the code; 6 is the default."
  - "Use size large on a touch screen and the same size in the whole field."
  - "Set masked only when the code is typed in a public place."
  - "Give it a name inside a form; read the code from value on input or change."
  - "Put the resend action below the field, as a separate nph-button; it is not part of the field."
accessibility:
  semantics: "One native text input inside the shadow root, laid over the cells. The cells only draw and are aria-hidden: the code is one value, with one name."
  accessible_name: "The label of nph-field, written as label. A label associated with the host names the inner input first, by element reference. With no name, the field renders and warns in development."
  keyboard:
    - "Tab enters and leaves the field: one stop for the whole code."
    - "Typing fills the active cell and moves to the next one."
    - "Backspace removes the character before the caret."
    - "Arrow Left, Arrow Right, Home and End move the active cell."
    - "Enter submits the form that owns the field."
  focus: "The active cell shows the focus border and the halo, outside the cell and out of the layout; space/inline is wider than the halo, so a neighbor never covers it."
  contrast: "The character and the dot use color/foreground, at least 4.5:1 on color/background; the border color/input and the error border status/error are at least 3:1, in light and dark in every brand. The disabled state has no minimum contrast."
  color_alternative: "The error always comes with the sentence of nph-field, read as the description; disabled combines opacity with the muted background."
invalid_combinations:
  - "A length other than 6 or 4 — the field draws nothing."
  - "A size other than default or large — the field draws nothing."
  - "masked together with a visible character — not possible: masked replaces every character by the dot."
  - "disabled with invalid — disabled wins: no error border and no aria-invalid."
relations:
  combines_with: [nph-field, nph-button]
  parents: ["nph-field", "form"]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Leaving the field without nph-field, with no label, help or error."
  - "Mixing cells of different sizes."
  - "Showing the dot and the character at the same time."
  - "Painting the resend action with a loose color instead of color/link."
  - "Using it for free text, where nph-input is the choice."
  - "Using it for a code whose length is not known in advance."
sources:
  design_md: "design.md, color/input, color/input-hover, color/background, color/foreground, color/muted, status/error, focus/border, focus/halo, focus/halo-error, focus/ring-width, border/width, radius/control, control/height-default, control/height-large, space/inline, text/code, state/disabled-opacity, and color/link for the resend action"
  decision: "P85 — API and semantics of nph-input-otp; P80 for the form pattern and P83 for the contract with nph-field"
  tests: "src/components/nph-input-otp/nph-input-otp.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-input-otp/nph-input-otp.stories.ts and nph-input-otp.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-input-otp board 1633:122, set 1633:120 and cell set 1633:29"
---

# nph-input-otp

## Function

**The problem it solves:** takes a short code of known length, sent by SMS or e-mail, with
one cell per character, to confirm access. It does not replace `nph-input`, which takes
free one-line text. The label, the help and the error come from `nph-field`; the resend
action is an `nph-button` below the field and is not part of it.

**When to use:**

- To confirm access with a code sent by SMS or e-mail: `length` 6 or 4, by the length of
  the code.
- On a touch screen, where the code is usually typed on the phone: `size` `large`; on
  other screens, `size` `default`.
- When the code is typed in a public place: `masked`.
- For a code with letters and numbers, such as `A7K2Q9`: the field takes it and the cell
  does not change.

**When NOT to use:**

- **For free one-line text** — use `nph-input`.
- **Without `nph-field`** — the label, the help and the error belong to `nph-field`.
- **With cells of different sizes** — use the same `size` in the whole field.
- **To paint the resend action with a loose color** — the resend is an `nph-button` below
  the field, with the label in `color/link`.

## Variants

| Variant | Choose when |
|---|---|
| `length` 6 | The default; a six-character code |
| `length` 4 | A four-character code |
| `size` `default` (36 px) | Most screens |
| `size` `large` (44 px) | A touch screen, where the code is usually typed on the phone |
| `masked` | The code is typed in a public place |

**By size:** `default` and `large`, the same in every cell.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** cells of different sizes in the same field.

The Figma cell properties `dígito` and `mostrar dígito` are not API: the character of each
cell comes from `value`, and a cell is empty while the code does not reach it.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/input` border, `color/background` background | The empty cells wait for the code |
| Hover | `color/input-hover` | Every cell border darkens while the pointer is over the field, which is one target |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width` | The active cell, where the next character goes, takes the focus border and a halo outside it |
| Error | `status/error` | Every cell takes the error border; the sentence is written by `nph-field` |
| Error with focus | `status/error`, `focus/halo-error` | The active cell keeps the error border; the halo turns to the error tone |
| Disabled | `color/muted`, `state/disabled-opacity` | The field cannot be focused or edited and is drawn lighter |

**Feedback and focus:** the active cell follows the caret. Focus puts the caret on the next
empty cell; with the code full, the last cell is active. `disabled` wins over `invalid`.

**Business rule the field carries:**

- It takes only ASCII letters and digits; any other character typed is dropped and fires
  nothing.
- A pasted code is cleaned and replaces the whole value, cut at `length`.
- Enter submits the form that owns the field, as a native input does.
- Setting `value` from code never fires `input` or `change`.
- The `value` attribute is the initial value and the reset value.

**Domain error states:** `invalid`, for a wrong or expired code. Every cell shows the error
border; `nph-field` writes the sentence and passes it as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | One native text input inside the shadow root, laid over the cells. The cells only draw and are hidden from assistive technology: the code is one value, with one name |
| Accessible name | The label of `nph-field`, written as `label`. A label associated with the host names the inner input first, by element reference. With no name, the field renders and warns in development |
| Description | The help or the error sentence of `nph-field`, written as `description`, read with the name |
| Keyboard | Tab enters and leaves the field, one stop. Typing fills the active cell; Backspace removes the character before the caret; the arrows, Home and End move the active cell; Enter submits the form |
| Focus | The active cell shows the focus border and the halo, out of the layout; `space/inline` is wider than the halo |
| Contrast | The character and the dot, `color/foreground`, at least 4.5:1 on `color/background`; the border `color/input` and the error border `status/error` at least 3:1, in light and dark in every brand. Disabled has no minimum |
| Alternative to color | The error always comes with the sentence of `nph-field`; disabled combines opacity with the muted background |
| Touch target | The whole field is the target. Each cell is 36 px in `default` and 44 px in `large`, with no inner padding; on a touch screen, use `large` |
| Known limits | `masked` is visual only: a screen reader reads the code. The inner input uses `text/code`, 14 px, so iOS Safari may zoom when the field takes focus. That a code received by SMS is offered by iOS through `autocomplete="one-time-code"` in an input inside a shadow root is to be confirmed on a device. Forced colors and right-to-left are not treated |

## Relations

**Combines with:** `nph-field`, which carries the label, the help and the error and writes
`label`, `description`, `invalid` and `required`; and `nph-button`, the resend action below
the field, disabled during the countdown.

**What is the parent:** `nph-field`, inside a form.

**What is the child:** none.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Space between cells | `space/inline` |
| Cell | `color/background` background, `color/input` border at `border/width`, `radius/control` |
| Cell size | `control/height-default` or `control/height-large`, as width and height |
| Character and dot | `text/code`, `color/foreground` |
| Hover | `color/input-hover` |
| Focus | `focus/border`, `focus/halo`, `focus/ring-width` |
| Error | `status/error`, `focus/halo-error` |
| Disabled | `color/muted`, `state/disabled-opacity` |

**Usage restrictions:** the field does not consume `color/link`, which belongs to the
resend action. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-input-otp` for a short code of known length sent by SMS or e-mail; for free text,
  use `nph-input`.
- Put it in an `nph-field`, which writes `label`, `description`, `invalid` and `required`.
- Set `length` to the length of the code; 6 is the default.
- Use `size` `large` on a touch screen and the same `size` in the whole field.
- Set `masked` only when the code is typed in a public place.
- Give it a `name` inside a form; read the code from `value` on `input` or `change`.
- Put the resend action below the field, as a separate `nph-button`; it is not part of the
  field.

## Examples

**Recommended case:** a code sent by e-mail, in an `nph-field` with the label, the field of
six cells and the help text.

**Alternative case:** a wrong code, with `invalid` and the error sentence of `nph-field`; or
a touch screen, with `size` `large`.

## Anti-patterns

- **Do not leave the field without `nph-field`** — the label, the help and the error belong
  to it.
- **Do not mix cells of different sizes** — use the same `size` in the whole field.
- **Do not show the dot and the character at the same time** — `masked` replaces the
  character.
- **Do not paint the resend action with a loose color** — use `color/link`.
- **Do not use it for free text** — use `nph-input`.
- **Do not use it for a code whose length is not known in advance.**
- **Invalid combinations:** a `length` other than 6 or 4; a `size` other than `default` or
  `large`; `disabled` with `invalid`, where `disabled` wins.
- **Do not create without a decision:** a color property, a separator between groups of
  cells, a `readonly`, a placeholder, a way to restrict the field to digits or the resend
  action inside the field.

## Sources and decisions

- **The repository `design.md`:** the tokens of the table above, and `color/link` for the
  resend action.
- **The decision that originated it:** P85, with the form pattern of P80 and the contract
  with `nph-field` of P83.
- **Tests:** `src/components/nph-input-otp/nph-input-otp.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-input-otp/nph-input-otp.stories.ts` (Validation) and
  `nph-input-otp.docs.stories.ts` (Docs).
- **Figma:** `nph-input-otp` board (`1633:122`), set `1633:120` and cell set `1633:29` in
  `DS-IA-NEPHOS 5.0`.
