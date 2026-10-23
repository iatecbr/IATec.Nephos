---
piece: nph-select
level: component
status: active
solves: >-
  Gives the person a field that opens a closed list of options to pick one, and
  takes part in the form that contains it.
use_when:
  - "When the person picks a single option from a closed list of 6 to 15 items."
  - "Inside an nph-field, which gives the label, the help text and the error message."
  - "With start=avatar when the options are people, and start=icon when a symbol helps recognize the option."
  - "default in general use; large on the screen that needs the 44 px target, for every field of the form."
do_not_use_when:
  - "For 2 to 5 options: use nph-radio, so the person sees all of them without opening anything."
  - "For more than 15 options, or when the person needs to search: use nph-combobox."
  - "To pick several options: use nph-multi-combobox."
  - "To name the field with the placeholder alone: it is replaced by the choice."
  - "With the magnifying glass at the start: search belongs to nph-combobox."
api:
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The height of the trigger and the width of the arrow area: control/height-default
      or control/height-large. Reflects because the internal CSS selects the height by
      it. Any other value draws nothing and emits console.error in development.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The current value. The value attribute is the initial value and the value of
      form.reset(), as in nph-input (P80). The chosen option is the first nph-option
      with that value; the value is kept until such an option arrives. Setting it from
      code fires no event.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The invitation before a choice, already localized, such as "Select an option".
      It is not a name: the choice replaces it.
  start:
    type: enum
    values: [none, icon, avatar]
    required: false
    default: none
    reflects: false
    constraint: >-
      The start of the trigger. icon: the icon of the chosen option when its own start
      is icon, otherwise the icon property. avatar: the photo of the chosen option when
      its own start is avatar, otherwise the empty avatar (D4). The dot of an option
      never goes to the trigger. Any other value draws nothing and emits console.error
      in development.
  icon:
    type: string
    required: false
    default: globe
    reflects: false
    constraint: >-
      A core name of nph-icon: the start icon with start=icon before a choice, or when
      the chosen option has no icon. magnifying-glass renders and warns in development:
      search belongs to nph-combobox. Any name outside the core draws nothing and emits
      console.error in development.
  open:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The list is open. The piece opens and closes it; the consumer may set it.
      Opening and closing fire no event. A disabled select, or one with no option to
      choose, does not open.
  name:
    type: string
    required: false
    default: "none"
    reflects: true
    constraint: >-
      The name of the entry in the form data. Reflects because the form reads the
      attribute of the host. With no chosen option, the entry is left out.
  required:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      With no choice, or with a chosen option of empty value, the piece is
      valueMissing, with the message of the browser. nph-field writes it. A form whose
      messages are written by nph-field uses novalidate when the browser balloon is not
      wanted.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity, on color/muted, out of the Tab order
      and of the form data; the list does not open. A disabled fieldset disables it
      too. It wins over invalid.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error state: the border becomes status/error and the trigger gets
      aria-invalid. It is not a constraint of the form. The sentence belongs to
      nph-field; never invalid without it.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name in text, never visible, for a select with no associated
      label; nph-field writes it. An associated label (a label element with for) wins
      over it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error
      sentence that nph-field writes.
  slot:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The options: nph-option children, as option children of a select. The list
      shows them in order.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host when the person chooses an option of a different value. It
      bubbles and crosses shadow roots. Read the value from the host.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host right after input. It bubbles. Setting value or open from code
      fires neither event.
variants:
  size:
    axis: size
    choose_when: "default in general use; large on the screen that needs the 44 px target for the accessibility of its users. One size per form, the same as the button next to the field."
    do_not_combine_with:
      - "default and large fields in the same form."
  start:
    axis: appearance
    choose_when: "avatar when the options are people; icon when a symbol helps recognize the option; none in every other case. The trigger repeats the start of the chosen option."
    do_not_combine_with:
      - "Options with and without a start in the same list."
      - "The magnifying glass as the start icon."
states:
  default:
    token: color/input
    changes_for_user: "The resting border, on color/background, with the arrow area in color/accent."
  hover:
    token: color/input-hover
    changes_for_user: "The border goes one step darker under the pointer."
  focus:
    token: focus/border
    changes_for_user: "Keyboard focus: the border takes focus/border with the focus/halo attached outside, at focus/radius-control."
  open:
    token: focus/border
    changes_for_user: "The focus look with the list open below the trigger and the arrow up (chevron-up)."
  error:
    token: status/error
    changes_for_user: "The border is status/error, also on hover; the sentence is in nph-field."
  error-focus:
    token: focus/halo-error
    changes_for_user: "The border stays status/error and the halo is focus/halo-error."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece at state/disabled-opacity on color/muted, with the color/input border; it does not open and wins over the error."
business_rules:
  - "The person chooses by a click on an option, or by Enter, Space or Alt+ArrowUp on the active option; the list closes and the focus stays on the trigger."
  - "A choice of a different value fires input and then change; choosing the option already chosen, Escape, Tab, a click outside and code fire nothing."
  - "Tab closes the list without choosing, and the focus moves on."
  - "Enter opens and chooses; it does not submit the form."
  - "Disabled options are skipped by the keyboard and cannot be chosen."
  - "disabled wins over invalid: no error look on a field the person cannot change."
domain_errors:
  - "invalid: the choice needs correction, such as a required field with no choice; nph-field writes the sentence and passes it as description."
tokens:
  height: "control/height-default or control/height-large"
  width: layout/input-width
  radius: radius/control
  border: "border/width, in color/input, color/input-hover, focus/border or status/error"
  background: "color/background; color/muted when disabled"
  padding: "space/control-padding on the left; 0 on the right"
  gap: space/inline
  value: "text/body-md in color/foreground"
  placeholder: "text/body-md in color/muted-foreground"
  start: "nph-icon icon/size-sm in color/muted-foreground, or nph-avatar sm"
  divider: "border/width in color/border"
  arrow_area: "color/accent, control/height-* wide, radius/none on the left and radius/control-inner on the right; the arrow icon/size-sm in color/muted-foreground"
  list: "color/popover, border/width in color/input, radius/container, elevation/dropdown, padding space/inline-tight, maximum height layout/max-list-height"
  list_offset: space/inline-tight
  motion: "motion/enter-duration, motion/enter-easing, motion/exit-duration and motion/exit-easing"
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width and focus/radius-control"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-select for one choice among 6 to 15 options; for 2 to 5, nph-radio; for more than 15 or with search, nph-combobox; for several, nph-multi-combobox."
  - "Put nph-select inside nph-field, which gives the label, the help text and the error message."
  - "Write the options as nph-option children, one start for the whole list."
  - "Never use the placeholder as the only name."
  - "To show an error, set the error of nph-field; do not set invalid on the select alone."
  - "Read the value from the host on input or change; do not listen for an nph-* event or for the opening of the list."
  - "Use the same size for every field and the button of one form."
accessibility:
  semantics: "A select-only combobox (APG): the trigger has role combobox, aria-haspopup listbox, aria-expanded and aria-controls; the list has role listbox and the options role option. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host, which the trigger and the list reference. Without one, from label. The placeholder is not a name. With no name at all, the select renders and warns in development."
  keyboard:
    - "Closed: Enter, Space, ArrowDown, ArrowUp and Alt+ArrowDown open the list on the chosen option, or on the first one; Home and End open it on the first and the last; a printable character opens it on the option that starts with it."
    - "Open: ArrowDown and ArrowUp move without wrapping; Home, End, PageUp and PageDown jump; typing moves to the option that starts with the typed text."
    - "Open: Enter, Space and Alt+ArrowUp choose the active option and close; Escape closes without choosing; Tab closes without choosing and the focus moves on."
  focus: "The focus stays on the trigger; the active option is pointed to by aria-activedescendant. The trigger shows the focus border and the halo for the keyboard and while the list is open."
  contrast: "The text of the trigger and of the option meets 4.5:1 and the border of the trigger meets 3:1, in light and dark mode; the arrow keeps 3:1 on color/accent; the check on color/primary-surface measures 4.78:1 and 6.26:1 (D8). The disabled state is exempt."
  color_alternative: "The error is said by the sentence of nph-field; the selected option has a background and the check; the dot goes with the written state; the arrow turns up when the list opens."
invalid_combinations:
  - "A size outside default and large — the select draws nothing."
  - "A start outside none, icon and avatar — the select draws nothing."
  - "An icon outside the core names — the select draws nothing."
  - "invalid without the sentence in nph-field — red with no text."
relations:
  combines_with: [nph-field, nph-option, nph-icon, nph-avatar, nph-button]
  parents: [nph-field, "form"]
  children: [nph-option, nph-icon, nph-avatar]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it with 2 to 5 options."
  - "Using it with more than 15 options, or when the person needs to search."
  - "Putting a checkbox on the option."
  - "Using the magnifying glass at the start."
  - "Mixing options with and without a start in the same list."
  - "Changing the color of the arrow area: for an error, use invalid."
  - "Using the status dot without a written state."
sources:
  design_md: "design.md, color/input, color/input-hover, color/accent, color/border, color/popover, color/primary-surface, status/*, focus/*, state/disabled-opacity, control/height-*, layout/input-width, layout/max-list-height, radius/control-inner, elevation/dropdown and motion/*"
  decision: "P91 — API and semantics of nph-select and nph-option; the form pattern is P80 and the field contract is P83"
  tests: "src/components/nph-select/nph-select.test.ts and src/components/nph-option/nph-option.test.ts"
  usage_evidence: "the Examples section of the nph-select Docs page"
  storybook: "src/components/nph-select/nph-select.stories.ts and nph-select.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-select frame 1357:160, documentation 1452:448, set 1357:115, option 1357:136 and list 1357:137"
---

# nph-select

## Function

**The problem it solves:** gives the person a field that opens a closed list of options to
pick one, and takes part in the form that contains it. The options are `nph-option`
children; the list is internal. The label, the help and the error message belong to
`nph-field`; the select shows only the `erro` state.

**When to use:**

- When the person picks a single option from a closed list of 6 to 15 items.
- Inside an `nph-field`, which gives the label, the help text and the error message.
- With `start="avatar"` when the options are people, and `start="icon"` when a symbol helps
  recognize the option.
- `default` in general use; `large` on the screen that needs the 44 px target, for every
  field of the form.

**When NOT to use:**

- **For 2 to 5 options** — use `nph-radio`, so the person sees all of them without opening
  anything.
- **For more than 15 options, or when the person needs to search** — use `nph-combobox`.
- **To pick several options** — use `nph-multi-combobox`.
- **To name the field with the placeholder alone** — it is replaced by the choice.
- **With the magnifying glass at the start** — search belongs to `nph-combobox`.

## Variants

**By appearance:** the start of the trigger, `none`, `icon` or `avatar`. The trigger repeats
the start of the chosen option; before a choice, `icon` shows `globe` (or `icon`) and
`avatar` the empty avatar (D4).

**By size:** `default` (`control/height-default`) and `large` (`control/height-large`). The
height of the trigger and the width of the arrow area change.

**By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| `default` | General use |
| `large` | The screen needs the 44 px target for the accessibility of its users |
| `start="icon"` | A symbol helps recognize the option |
| `start="avatar"` | The options are people |

**Do not combine with:** `default` and `large` fields in the same form; options with and
without a start in the same list; the magnifying glass as the start icon.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/input` | The resting border, on `color/background`, with the arrow area in `color/accent` |
| `hover` | `color/input-hover` | The border goes one step darker under the pointer |
| `foco` | `focus/border`, `focus/halo` | Keyboard focus: the border takes `focus/border`, with the halo attached outside at `focus/radius-control` |
| `aberto` | `focus/border`, `focus/halo` | The focus look with the list open below the trigger and the arrow up |
| `erro` | `status/error` | The border is `status/error`, also on hover |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error` |
| `disabled` | `state/disabled-opacity`, `color/muted` | The whole piece at `state/disabled-opacity` on `color/muted`, with the `color/input` border; the arrow area keeps `color/accent` (D-1, open) |

**Feedback and focus:** `disabled` wins over everything; `erro` keeps its border on hover, on
focus and open. The focus look shows for the keyboard and while the list is open; a click
that closes the list leaves no focus ring, as in a native select.

**The list:** it opens `space/inline-tight` below the trigger (D1), with its width; it turns
up when it does not fit below and fits above (D-2, open). It fades in and slides
`space/inline-tight` into place, with `motion/enter-*`, and leaves with `motion/exit-*`; with
reduced motion, only the opacity changes (D2). It shows 8 whole options of 36 px inside
`layout/max-list-height`, with its border outside that height, and scrolls above that (D9).

**Business rule the piece carries:**

- The person chooses by a click on an option, or by Enter, Space or Alt+ArrowUp on the
  active option; the list closes and the focus stays on the trigger.
- A choice of a different value fires `input` and then `change`; choosing the option already
  chosen, Escape, Tab, a click outside and code fire nothing.
- Tab closes the list without choosing, and the focus moves on.
- Enter opens and chooses; it does not submit the form.
- Disabled options are skipped by the keyboard and cannot be chosen.
- `disabled` wins over `invalid`.

**Domain error states:** `invalid`, when the choice needs correction, such as a required field
with no choice. `nph-field` writes the sentence and passes it to the select as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | A select-only combobox (APG): the trigger has role `combobox`, `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`; the list has role `listbox`; each `nph-option` has role `option` and `aria-selected`. The host is form-associated and labelable |
| Accessible name | From the label associated with the host, which the trigger and the list reference. Without one, from `label`; `nph-field` writes it. The placeholder is not a name. With no name at all, the select renders and warns in development |
| Description | `description`, read when the trigger takes focus: the help or the error sentence of `nph-field` |
| Keyboard | Closed: Enter, Space, ArrowDown, ArrowUp and Alt+ArrowDown open on the chosen option, or on the first; Home and End open on the first and the last; a character opens on the option that starts with it. Open: the arrows move without wrapping; Home, End, PageUp and PageDown jump; typing moves to the matching option; Enter, Space and Alt+ArrowUp choose and close; Escape closes without choosing; Tab closes without choosing and the focus moves on |
| Focus | The focus stays on the trigger; the active option is pointed to by `aria-activedescendant` |
| Contrast | The text of the trigger and of the option meets 4.5:1 and the border of the trigger 3:1, in light and dark mode; the arrow keeps 3:1 on `color/accent`; the check on `color/primary-surface` measures 4.78:1 and 6.26:1 (D8). The disabled state is exempt |
| Alternative to color | The error is said by the sentence of `nph-field`; the selected option has a background and the check; the dot goes with the written state; the arrow turns up when the list opens |
| Hidden parts | The start, the divider, the arrow, the dot and the check are hidden from the screen reader: the text says the option |
| Touch target | The whole trigger, arrow area included; `large` guarantees 44 px. The option takes the width of the list |
| Known limits | Forced colors and right-to-left are not treated yet. The list turns up near the bottom of the window but does not shrink when neither side fits |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help and the error; `nph-option`,
its options; `nph-icon` and `nph-avatar`, in the start, the arrow and the check; and
`nph-button`, side by side in the same size.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-option`, in the list; `nph-icon` and `nph-avatar`, in the trigger.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Trigger | Height `control/height-default` or `control/height-large`; width `layout/input-width`; radius `radius/control`; border `border/width`; left padding `space/control-padding`, right 0; gap `space/inline`; background `color/background` |
| Value | `text/body-md`, `color/foreground`, one line with an ellipsis (D3) |
| Placeholder | `text/body-md`, `color/muted-foreground` |
| Start | `nph-icon` `icon/size-sm` in `color/muted-foreground`, or `nph-avatar` `sm` |
| Divider | `border/width` in `color/border`, beside the arrow area (D7) |
| Arrow area | `color/accent`; `control/height-*` wide, the trigger height minus its two borders; `radius/none` on the left, `radius/control-inner` on the right; the arrow `icon/size-sm` in `color/muted-foreground` |
| List | `color/popover`; border `border/width` in `color/input`; `radius/container`; `elevation/dropdown`; padding `space/inline-tight`; maximum height `layout/max-list-height`, border outside it (D9); offset `space/inline-tight` (D1) |
| Motion | `motion/enter-duration`, `motion/enter-easing`, `motion/exit-duration`, `motion/exit-easing`; opacity only with reduced motion (D2) |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width`, `focus/radius-control` |
| Disabled | `state/disabled-opacity` on `color/muted` |

**Usage restrictions:** `color/accent` is the permanent background of the arrow area; do not
change it, also not for an error. `color/muted` is only the disabled background. The width may
stretch to the parent.

**AI hints:**

- Use `nph-select` for one choice among 6 to 15 options; for 2 to 5, `nph-radio`; for more
  than 15 or with search, `nph-combobox`; for several, `nph-multi-combobox`.
- Put `nph-select` inside `nph-field`, which gives the label, the help text and the error
  message.
- Write the options as `nph-option` children, one start for the whole list.
- Never use the placeholder as the only name.
- To show an error, set the error of `nph-field`; do not set `invalid` on the select alone.
- Read the value from the host on `input` or `change`; do not listen for an `nph-*` event or
  for the opening of the list.
- Use the same size for every field and the button of one form.

## Examples

**Recommended case:** "Department" — inside an `nph-field` with a label and help text, a short
list with no start and a placeholder.

**Alternative case:** "Owner" — `start="avatar"`, each option with its photo and a secondary
text, the chosen person repeated in the trigger. With `required` and no choice, the field
writes the error and the select shows `erro`.

## Anti-patterns

- **Do not use it with 2 to 5 options** — use `nph-radio`.
- **Do not use it with more than 15 options** — use `nph-combobox`.
- **Do not put a checkbox on the option** — multiple choice belongs to `nph-multi-combobox`.
- **Do not use the magnifying glass at the start** — it suggests search.
- **Do not mix options with and without a start in the same list.**
- **Do not change the color of the arrow area** — for an error, use `invalid` through
  `nph-field`.
- **Do not use the status dot without a written state.**
- **Invalid combinations:** a `size` outside the two; a `start` outside the three; an `icon`
  outside the core; `invalid` without the sentence in `nph-field`.
- **Do not create without a decision:** search, groups, multiple choice, a width property, a
  color property, an event for opening and closing, or a read-only state.

## Sources and decisions

- **The repository `design.md`:** `color/input`, `color/input-hover`, `color/accent`,
  `color/border`, `color/popover`, `color/primary-surface`, `status/*`, `focus/*`,
  `state/disabled-opacity`, `control/height-*`, `layout/input-width`,
  `layout/max-list-height`, `radius/control-inner`, `elevation/dropdown` and `motion/*`.
- **The decision that originated it:** P91, the API and semantics of `nph-select` and
  `nph-option`; the form pattern is P80 and the field contract is P83.
- **Tests:** `src/components/nph-select/nph-select.test.ts` and
  `src/components/nph-option/nph-option.test.ts`.
- **Usage evidence:** the Examples section of the `nph-select` Docs page.
- **Storybook:** `src/components/nph-select/nph-select.stories.ts` (Validation) and
  `nph-select.docs.stories.ts` (Docs).
- **Figma:** `nph-select` frame (`1357:160`), documentation `1452:448`, set `1357:115`,
  option `1357:136` and list `1357:137` in `DS-IA-NEPHOS 5.0`.
