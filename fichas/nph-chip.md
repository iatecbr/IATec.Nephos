---
piece: nph-chip
level: component
status: active
solves: >-
  Shows an applied filter, a value chosen in a field or a quick filter that the person checks
  and unchecks, in a small rounded piece with one action.
use_when:
  - "With type removable, for a filter already applied or a value chosen that the person can take away."
  - "With type selectable, for a quick filter that the person checks and unchecks; several can stay checked."
  - "With a status severity, when the value of the filter is a status; the label says which."
  - "With an icon, to recognize the type of the filter; with an avatar, when the value is a person; with a counter, to show how many items the option has before the click."
  - "With size compact in the toolbar, the table and the field; with size default on a selectable chip inside a form."
do_not_use_when:
  - "For a system status with no action: use nph-badge."
  - "To run an action, such as delete the selected: use nph-button."
  - "In a line of chips that scrolls sideways: let the chips wrap."
api:
  type:
    type: enum
    values: [removable, selectable]
    required: false
    default: "removable"
    reflects: true
    constraint: >-
      The Figma `tipo`. removable: the X takes the value away and the body has no action.
      selectable: a quick filter, the whole chip a toggle button with aria-pressed. Outside
      the list, the piece draws nothing and emits console.error in development.
  severity:
    type: enum
    values: [default, success, warning, error, info, help]
    required: false
    default: "default"
    reflects: true
    constraint: >-
      The Figma `cor`. A status color exists only on a removable chip with text content: no
      icon, no avatar, and none of marked, readonly and invalid. A selectable chip has the
      default severity only. Outside the list, the piece draws nothing and emits
      console.error in development.
  size:
    type: enum
    values: [compact, default]
    required: false
    default: "compact"
    reflects: true
    constraint: >-
      The Figma `tamanho`: chip/height-compact or chip/height-default. The target of the X is
      the same in both. Outside the list, the piece draws nothing and emits console.error in
      development.
  text:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The label, already localized, in one line, cut with an ellipsis at chip/max-width; the
      whole text shows in an nph-tooltip on hover and on keyboard focus (D-3). Without text,
      the piece draws nothing and emits no error.
  icon:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A core name of nph-icon, before the text, decorative. At most one of icon, avatar and
      counter. A name outside the core draws nothing and emits console.error in development.
  avatar:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      Draws an nph-avatar in the sm size before the text (D-2), decorative. Removable only,
      and not with icon or counter. Reflects because the internal CSS selects the start
      padding by it.
  avatar-src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The photo of the avatar. Without it, the avatar draws the person icon. It needs avatar.
  counter:
    type: number
    required: false
    default: "none"
    reflects: false
    constraint: >-
      A whole number from zero up, drawn as a pill after the text (D-1). Selectable only, and
      not with icon or avatar.
  remove-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The word the X says before the text, such as Remove filter, so the X reads Remove
      filter Status: Waiting, as nph-multi-combobox (P96). Required while the X shows on a
      removable chip: without it, the piece draws nothing and emits console.error in
      development.
  selected:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The checked selectable chip, the Figma `selecionado`. It shows the X as a mark only: the
      click belongs to the whole chip. A removable chip is never selected. Changing it from
      code fires nothing.
  marked:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma `marcado`: the last chip of a field, ready to leave, with the hover background
      and the focus ring on the whole chip. Removable, default severity, one state at a time.
  readonly:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma `somente leitura`: the value with no X. Removable, default severity, one
      state at a time. Needs no remove-label.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The Figma `inválido`: chip/invalid-background, chip/invalid-border and
      chip/invalid-foreground; the X takes the error pair on hover and focus (D-4). Removable,
      default severity, one state at a time. The message belongs to the field.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole chip at state/disabled-opacity, out of the Tab order, with no click and no
      balloon. It wins over the other states, with no error.
  nph-remove:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired on the host (bubbles, composed) only when the person presses the X of a removable
      chip, with detail { text }. The chip does not remove itself: the consumer does.
  nph-selected-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired on the host (bubbles, composed) only when the person toggles a selectable chip,
      with detail { selected }, after selected changed. Setting selected from code fires
      nothing.
variants:
  removable:
    axis: appearance
    choose_when: "An applied filter or a chosen value that the person can take away."
    do_not_combine_with: [counter, selected]
  selectable:
    axis: appearance
    choose_when: "A quick filter that the person checks and unchecks with one click."
    do_not_combine_with: [avatar, marked, readonly, invalid]
  status:
    axis: appearance
    choose_when: "A removable chip with text, when the value of the filter is a status."
    do_not_combine_with: [icon, avatar, marked, readonly, invalid, selectable]
  compact:
    axis: size
    choose_when: "The toolbar, the table and the field."
    do_not_combine_with: []
  default:
    axis: size
    choose_when: "A selectable chip inside a form."
    do_not_combine_with: []
states:
  removable-rest:
    token: chip/background
    changes_for_user: "The label in chip/foreground, a border chip/border inside and the X."
  x-hover-active:
    token: chip/remove-background-hover
    changes_for_user: "The X gains the hover background; in a status color, the pair of the status."
  x-focus:
    token: focus/border
    changes_for_user: "Border focus/border and halo focus/halo around the X; in a status color, the focus pair of the status."
  marked:
    token: chip/background-hover
    changes_for_user: "The hover background and the focus ring on the whole chip: the last chip of the field, ready to leave."
  readonly:
    token: chip/background
    changes_for_user: "The value with no X."
  invalid:
    token: chip/invalid-background
    changes_for_user: "Border chip/invalid-border and text chip/invalid-foreground; the X takes the error pair on hover and focus (D-4)."
  selectable-rest:
    token: chip/background
    changes_for_user: "The label in chip/foreground and, with a counter, the pill on chip/counter-background."
  selectable-hover-active:
    token: chip/background-hover
    changes_for_user: "The hover background and the counter on chip/counter-background-hover."
  selectable-focus:
    token: focus/border
    changes_for_user: "Border focus/border and halo focus/halo around the whole chip."
  selected:
    token: chip/background-selected
    changes_for_user: "The full background, the label in chip/foreground-selected, no border and the X shown as a mark."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole chip faded, on chip/background-disabled and with no border, out of the Tab order, with no click and no balloon."
business_rules:
  - "The removable chip never removes itself: it fires nph-remove and the consumer takes the value away."
  - "The click on the X is not a click on the chip; on a selectable chip the X is a mark, and the click belongs to the whole chip."
  - "A label that does not fit is cut with an ellipsis and shows the whole text in a balloon on hover and on keyboard focus; a label that is not cut takes no focus (D-3)."
  - "A chip with no text draws nothing and emits no error."
  - "Disabled wins over the other states, with no error."
domain_errors: []
tokens:
  container: "chip/background, radius chip/radius, height chip/height-compact or chip/height-default, maximum width chip/max-width, gap chip/gap, border chip/border-width in chip/border drawn inside"
  padding: "chip/padding-x with text or counter; chip/padding-start-icon with an icon; chip/padding-start-avatar with an avatar; chip/padding-end-remove or chip/padding-end-remove-default with the X; chip/padding-end-counter after the counter"
  label: "text/label-md in chip/foreground"
  status: "chip/<status>-background, chip/<status>-border and chip/<status>-foreground, with <status> as success, warning, error, info or help; the X stays in chip/foreground"
  marked: "chip/background-hover with the focus ring on the whole chip"
  invalid: "chip/invalid-background, chip/invalid-border, chip/invalid-foreground; the X on chip/error-remove-background-hover, focus ring chip/error-focus-border and chip/error-focus-halo (D-4)"
  selected: "chip/background-selected, chip/background-selected-hover and chip/foreground-selected, no border"
  hover: "chip/background-hover on the selectable chip"
  counter: "A pill of its own (D-1): chip/counter-background, chip/counter-background-hover, chip/counter-background-disabled and chip/counter-foreground in text/label-sm, chip/counter-padding-y and chip/counter-padding-x, radius radius/full"
  remove: "target chip/remove-size, radius chip/remove-radius, background chip/remove-background-hover on hover, focus and active; in a status color, chip/<status>-remove-background-hover"
  icons: "nph-icon at icon/size-sm; the content icon and the X in chip/foreground, chip/invalid-foreground when invalid and chip/foreground-selected when selected"
  disabled: "chip/background-disabled at state/disabled-opacity, no border"
  focus: "border focus/border and halo focus/halo of width focus/ring-width, round as chip/radius; in a status color chip/<status>-focus-border and chip/<status>-focus-halo"
ai_hints:
  - "Use nph-chip for an applied filter, a value chosen in a field or a quick filter; for a system status with no action, use nph-badge, and to run an action, use nph-button."
  - "Choose removable when the X takes the value away, and selectable when the person checks and unchecks it with one click."
  - "Choose a status severity only when the value of the filter is a status, on a removable chip with text; the label says which."
  - "Choose an avatar when the value is a person, an icon to recognize the type of the filter and a counter to show how many items the option has."
  - "Choose compact in the toolbar, the table and the field, and default on a selectable chip inside a form."
  - "Give text and remove-label already localized: the X reads the word and the text."
  - "Listen to nph-remove to take the value away and to nph-selected-change to apply the quick filter; do not listen to click."
  - "Let the chips wrap in the line; do not put them in a horizontal scroll."
accessibility:
  semantics: "A removable chip is a span with a native button, the X; a selectable chip is a native button with aria-pressed. Icon and avatar are decorative and hidden from the screen reader."
  accessible_name: "The X is named by remove-label and the text, such as Remove filter Status: Waiting. The selectable chip is named by its text and, with a counter, the number: Pending 12."
  keyboard:
    - "Tab: reaches the X of a removable chip, the whole selectable chip and a cut label; a disabled chip is skipped."
    - "Enter or Space: presses the X (nph-remove) or toggles the selectable chip (nph-selected-change)."
    - "Esc: closes the balloon of a cut label."
  focus: "Border focus/border and halo focus/halo, keyboard only: around the X of a removable chip, around the whole chip when selectable, marked or when the cut label has the focus; in a status color, the focus pair of the status."
  contrast: "Text and X pass 4.5:1 over the chip background in every state, in both modes. The border marks the edge of the chip against the page and does not need 3:1, because the text already identifies the piece (WCAG 1.4.11)."
  color_alternative: "The selected chip also shows the X and the full background; the status is written in the label; the invalid chip has a red border and a message below the field."
invalid_combinations:
  - "A type, a severity or a size outside the lists — the piece draws nothing."
  - "An icon outside the core of nph-icon."
  - "More than one of icon, avatar and counter."
  - "avatar-src without avatar."
  - "A counter that is not a whole number from zero up."
  - "A removable chip with a counter, or selected."
  - "A selectable chip with an avatar, a status severity, marked, readonly or invalid."
  - "More than one of marked, readonly and invalid."
  - "A status severity with marked, readonly or invalid, or with an icon or an avatar."
  - "A removable chip with an X and no remove-label."
relations:
  combines_with: [nph-icon, nph-avatar, nph-tooltip, nph-button, nph-badge]
  parents: [nph-toolbar, nph-field]
  children: [nph-icon, nph-avatar, nph-tooltip]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using a chip for a system status with no action: use nph-badge."
  - "Using a chip to run an action: use nph-button."
  - "Putting the line of chips in a horizontal scroll: let it wrap."
  - "Marking the selected chip only by color: it also shows the X and the full background."
  - "Using a status severity for something that is not a status."
sources:
  design_md: "design.md, the tokens named in the evidence; the chip/* tokens are in src/tokens/source/semantic.tokens.json"
  decision: "P100 — nph-chip: API and semantics"
  tests: "src/components/nph-chip/nph-chip.test.ts and nph-chip.docs.test.ts"
  usage_evidence: "the mandatory examples of the nph-chip Docs page and of the Examples story"
  storybook: "src/components/nph-chip/nph-chip.stories.ts and nph-chip.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, page NPH — Chip 1626:40, documentation 3077:2240, set 3076:1439, board 3077:807"
---

# nph-chip

## Function

**The problem it solves:** shows an applied filter, a value chosen in a field or a quick
filter that the person checks and unchecks, in a small rounded piece with one action: take the
value away or toggle it. It does not replace `nph-badge`, which shows a system status with no
action, nor `nph-button`, which runs an action.

**When to use:**

- With type `removable`, for a filter already applied or a value chosen that the person can
  take away.
- With type `selectable`, for a quick filter that the person checks and unchecks; several can
  stay checked.
- With a status severity, when the value of the filter is a status; the label says which.
- With an icon, to recognize the type of the filter; with an avatar, when the value is a
  person; with a counter, to show how many items the option has before the click.
- With size `compact` in the toolbar, the table and the field; with size `default` on a
  selectable chip inside a form.

**When NOT to use:**

- **For a system status with no action** — use `nph-badge`.
- **To run an action**, such as delete the selected — use `nph-button`.
- **In a line of chips that scrolls sideways** — let the chips wrap.

## Variants

**By appearance:** the type, `removable` or `selectable`, and the severity: `default` or a
status color.

**By size:** `compact` and `default`.

**By density:** `not_applicable`.

| Figma | Code | What it is | Choose when |
|---|---|---|---|
| `tipo` `removível` | `type="removable"` | The X takes the value away; the body has no action | An applied filter or a chosen value |
| `tipo` `seleção` | `type="selectable"` | The whole chip is a toggle button; the selected chip shows the X | A quick filter |
| `cor` `padrão` | `severity="default"` | The color of the chip | Any chip |
| `cor` `sucesso`, `aviso`, `erro`, `informação`, `ajuda` | `severity` `success`, `warning`, `error`, `info`, `help` | Border, background and label in the color; the X stays in the foreground color | The value of the filter is a status; removable with text only |
| `conteúdo` `texto` | none | The label alone | Any chip |
| `conteúdo` `ícone` | `icon` | A core icon before the text | To recognize the type of the filter |
| `conteúdo` `avatar` | `avatar`, `avatar-src` | An `nph-avatar` before the text; removable only | The value is a person |
| `conteúdo` `contador` | `counter` | A pill after the text; selectable only | To show how many items the option has |
| `tamanho` `compacto`, `padrão` | `size="compact"`, `size="default"` | `chip/height-compact` and `chip/height-default` | The toolbar, the table and the field; a selectable chip inside a form |

The Figma `conteúdo` is not a property: `icon`, `avatar` or `counter`, at most one of them. A
long label is not a property: the text is cut with an ellipsis.

**Do not combine with:** a counter on a removable chip; an avatar or a status severity on a
selectable chip; a status severity with an icon, an avatar or a state; more than one of
`marked`, `readonly` and `invalid`. The combinations of the Figma set are the only ones the
piece draws.

## States

| Type · state | Token | What changes for the person |
|---|---|---|
| Removable · rest | `chip/background`, `chip/border` | The label in `chip/foreground` and the X |
| Removable · X hover, active | `chip/remove-background-hover` | The X gains the hover background; in a status color, `chip/<status>-remove-background-hover` |
| Removable · X focus | `focus/border`, `focus/halo` | Border and halo around the X; in a status color, `chip/<status>-focus-border` and `chip/<status>-focus-halo` |
| Removable · marked | `chip/background-hover` | The hover background and the focus ring on the whole chip: the last chip of the field, ready to leave |
| Removable · read only | `chip/background` | The value with no X |
| Removable · invalid | `chip/invalid-background`, `chip/invalid-border`, `chip/invalid-foreground` | The red border and text; the X takes the error pair on hover and focus (D-4) |
| Selectable · rest | `chip/background` | The label and, with a counter, the pill on `chip/counter-background` |
| Selectable · hover, active | `chip/background-hover`, `chip/counter-background-hover` | The hover background; the pill does not disappear |
| Selectable · focus | `focus/border`, `focus/halo` | Border and halo around the whole chip |
| Selectable · selected | `chip/background-selected`, `chip/foreground-selected` | The full background, no border and the X as a mark; hover `chip/background-selected-hover` |
| Disabled | `state/disabled-opacity`, `chip/background-disabled` | Faded, no border, out of the Tab order, with no click and no balloon; the selected chip keeps its full background |

**Feedback and focus:** keyboard focus draws the border `border/width` in `focus/border` and
the halo `focus/ring-width` in `focus/halo`, round as the chip: around the X of a removable
chip; around the whole chip when it is selectable, marked or when the cut label has the focus.
In a status color, the ring of the X follows the status.

**Business rule the piece carries:**

- The removable chip never removes itself: it fires `nph-remove` and the consumer takes the
  value away.
- The click on the X is not a click on the chip; on a selectable chip the X is a mark, and the
  click belongs to the whole chip.
- A label that does not fit is cut with an ellipsis and shows the whole text in an
  `nph-tooltip` on hover and on keyboard focus. The cut label takes the focus (`tabindex` 0) so
  the balloon has a target; a label that is not cut takes no focus (D-3). On a selectable chip
  the balloon is the name, followed by the counter, so the text is not read twice.
- A chip with no text draws nothing and emits no error.
- `disabled` wins over the other states, with no error.

**Domain error states:** `not_applicable`. The invalid state is the value that the field
refuses; the message belongs to the field.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A removable chip is a `span` with a native `button`, the X; a selectable chip is a native `button` with `aria-pressed`. Icon and avatar are decorative and hidden from the screen reader |
| Accessible name | The X is named by `remove-label` and the text, such as "Remove filter Status: Waiting" (P96). The selectable chip is named by its text and, with a counter, the number |
| Keyboard | Tab reaches the X of a removable chip, the whole selectable chip and a cut label, and skips a disabled chip; Enter and Space press the X or toggle the chip; Esc closes the balloon |
| Focus | Border `focus/border` and halo `focus/halo`, keyboard only; in a status color, the focus pair of the status |
| Contrast | Text and X pass 4.5:1 over the chip background in every state, in both modes. The border marks the edge against the page and does not need 3:1 (WCAG 1.4.11) |
| Alternative to color | The selected chip also shows the X and the full background; the status is written in the label; the invalid chip has a red border and a message below the field |
| Touch target | The X has the target `chip/remove-size` in both sizes |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-icon` and `nph-avatar` (before the text), `nph-tooltip` (the balloon of
a cut label), `nph-button` ("Clear filters" after the last chip of the toolbar) and
`nph-badge`, which shows a status with no action where the chip always has one.

**What is the parent:** `nph-toolbar`, which keeps the applied filters in a line below the bar,
and `nph-field`, inside which each chosen value is a removable chip; the field controls the
border, the focus of the group and the error message. The field that holds chips is not built
yet.

**What is the child:** `nph-icon`, `nph-avatar` and `nph-tooltip`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**Space between chips:** `space/inline`; when there is no room, the chips wrap to the next
line.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container | `chip/background`, radius `chip/radius`, height `chip/height-compact` or `chip/height-default`, maximum width `chip/max-width`, gap `chip/gap`; border `chip/border-width` in `chip/border`, drawn inside and never counted in the size |
| Padding | `chip/padding-x`; with an icon `chip/padding-start-icon`; with an avatar `chip/padding-start-avatar`; with the X `chip/padding-end-remove` or `chip/padding-end-remove-default`; after the counter `chip/padding-end-counter` |
| Label | `text/label-md` in `chip/foreground` |
| Status | `chip/<status>-background`, `chip/<status>-border` and `chip/<status>-foreground`; the X stays in `chip/foreground` |
| Marked | `chip/background-hover` with the focus ring |
| Invalid | `chip/invalid-background`, `chip/invalid-border`, `chip/invalid-foreground`; the X on `chip/error-remove-background-hover` with `chip/error-focus-border` and `chip/error-focus-halo` (D-4) |
| Selected | `chip/background-selected`, `chip/background-selected-hover`, `chip/foreground-selected`, no border |
| Counter | A pill of its own (D-1): `chip/counter-background`, `chip/counter-background-hover`, `chip/counter-background-disabled`, `chip/counter-foreground` in `text/label-sm`, `chip/counter-padding-y`, `chip/counter-padding-x`, radius `radius/full` |
| X | Target `chip/remove-size`, radius `chip/remove-radius`, `chip/remove-background-hover` |
| Icons | `icon/size-sm`; `chip/foreground`, `chip/invalid-foreground` when invalid, `chip/foreground-selected` when selected |
| Disabled | `chip/background-disabled` at `state/disabled-opacity`, no border |
| Focus | Border `border/width` in `focus/border`, halo `focus/ring-width` in `focus/halo`, radius `chip/radius` |

**Usage restrictions:** the chip draws its own counter as a pill with the `chip/counter-*`
tokens, and does not use `nph-badge`: the evidence calls the counter an `nph-badge` and gives
it paint tokens that `nph-badge` does not paint, and `nph-badge` has no color property and no
`::part` (pending decision D-1 of DSA-57, P100). The avatar is `nph-avatar` in the `sm` size
(D-2). The invalid X takes the error pair on hover and focus (D-4). The order is icon, text,
counter and X (D-5). The events are `nph-remove` and `nph-selected-change`, not `nph-change`,
which `nph-togglebutton` already types.

**AI hints:**

- Use `nph-chip` for an applied filter, a value chosen in a field or a quick filter; for a
  system status with no action, use `nph-badge`, and to run an action, use `nph-button`.
- Choose `removable` when the X takes the value away, and `selectable` when the person checks
  and unchecks it with one click.
- Choose a status severity only when the value of the filter is a status, on a removable chip
  with text; the label says which.
- Choose an avatar when the value is a person, an icon to recognize the type of the filter and
  a counter to show how many items the option has.
- Choose `compact` in the toolbar, the table and the field, and `default` on a selectable chip
  inside a form.
- Give `text` and `remove-label` already localized: the X reads the word and the text.
- Listen to `nph-remove` to take the value away and to `nph-selected-change` to apply the quick
  filter; do not listen to `click`.
- Let the chips wrap in the line; do not put them in a horizontal scroll.

## Examples

**Recommended case:** the applied filters of the toolbar, in a line below the bar: "Period:
October" with an icon, "Status: Late" in a status color and "Ana Souza" with an avatar,
followed by "Clear filters", an `nph-button` secondary, ghost, compact.

**Alternative case:** the values chosen in a field, one of them invalid; and quick filters
("Pending", "Approved", "Late") that the person checks and unchecks, with counters.

## Anti-patterns

- **Do not use a chip for a system status with no action** — use `nph-badge`.
- **Do not use a chip to run an action** — use `nph-button`.
- **Do not put the line of chips in a horizontal scroll** — let it wrap.
- **Do not mark the selected chip only by color** — it also shows the X and the full
  background.
- **Do not use a status severity for something that is not a status.**
- **Invalid combinations:** a type, a severity or a size outside the lists; an icon outside the
  core; more than one of icon, avatar and counter; `avatar-src` without `avatar`; a counter
  that is not a whole number from zero up; a counter or `selected` on a removable chip; an
  avatar, a status severity, `marked`, `readonly` or `invalid` on a selectable chip; more than
  one of `marked`, `readonly` and `invalid`; a status severity with a state, an icon or an
  avatar; a removable chip with an X and no `remove-label`.
- **Do not create without a decision:** a slot, a size, a color property, a `::part`, an `nph-change`
  event or a field that holds chips.

## Sources and decisions

- **The repository `design.md`:** the tokens named in the evidence. The `chip/*` tokens are in
  `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P100.
- **Pending decisions:** D-1 to D-5 of the task DSA-57: the counter as a pill of its own instead
  of `nph-badge`, the `sm` size of the avatar, the cut label focusable with its balloon, the
  error pair on the X of the invalid chip, and the order icon, text, counter and X.
- **Tests:** `src/components/nph-chip/nph-chip.test.ts` and `nph-chip.docs.test.ts`.
- **Usage evidence:** the mandatory examples of the `nph-chip` Docs page and of the Examples
  story.
- **Storybook:** `src/components/nph-chip/nph-chip.stories.ts` and `nph-chip.docs.stories.ts`.
- **Figma:** `DS-IA-NEPHOS 5.0`, page `NPH — Chip` `1626:40`, documentation `3077:2240`, set
  `3076:1439`, board `3077:807`.
