---
piece: nph-option
level: component
status: active
solves: >-
  Gives a list the person picks from one option with its label and, when needed, a
  start, a helper text and the selected look, shared by the lists of nph-select and
  nph-combobox.
use_when:
  - "As a child of nph-select, one per option of the list."
  - "With start=dot when each option has a state, written in the label."
  - "With secondary when a helper text tells options with similar labels apart."
do_not_use_when:
  - "On its own, outside the list that owns it: it has no role there."
  - "With a checkbox marker: multiple choice belongs to nph-multi-combobox."
  - "Mixing options with and without a start in the same list: use one start."
  - "With the status dot and no state written in the label."
api:
  slot:
    type: string
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The label: the text of the option, already localized. It is the accessible name
      of the option and the text the trigger shows when it is chosen.
  value:
    type: string
    required: false
    default: "the label text"
    reflects: true
    constraint: >-
      The value the option gives the form. Without the attribute, the label text with
      its white space collapsed, as in the native option.
  secondary:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The helper text after the label, already localized. Empty turns it off.
  start:
    type: enum
    values: [none, icon, avatar, dot]
    required: false
    default: none
    reflects: false
    constraint: >-
      The start of the option. The same start for every option of a list. Any other
      value draws nothing and emits console.error in development.
  icon:
    type: string
    required: false
    default: globe
    reflects: false
    constraint: >-
      A core name of nph-icon, drawn with start=icon at icon/size-md. Any name outside
      the core draws nothing and emits console.error in development.
  src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The photo of the avatar, with start=avatar. Empty shows the empty avatar.
  status:
    type: enum
    values: [neutral, info, warning, success, error, help]
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The color of the dot, with start=dot: status/* or, for neutral,
      color/muted-foreground. Absent, the dot follows the text color (D6). Any other
      value draws nothing and emits console.error in development.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The option cannot be chosen and the keyboard skips it; the whole option at
      state/disabled-opacity.
  selected:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Written by the list that owns the option, never by the consumer: the chosen
      option. The list chooses by its own value. There is no selected attribute.
  active:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Written by the list that owns the option, never by the consumer: the option the
      pointer or the keyboard is on.
variants:
  start:
    axis: appearance
    choose_when: "icon when a symbol helps recognize the option; avatar when the options are people; dot when each option has a state; none in every other case."
    do_not_combine_with:
      - "Options with and without a start in the same list."
      - "A checkbox marker, which belongs to nph-multi-combobox."
states:
  default:
    token: color/popover-foreground
    changes_for_user: "The label in color/popover-foreground on the list background, with no background of its own."
  active:
    token: color/accent
    changes_for_user: "The option the pointer or the keyboard is on: color/accent, with the text in color/accent-foreground (D5)."
  selected:
    token: color/primary-surface
    changes_for_user: "The chosen option: color/primary-surface and the check in color/primary. It wins over active (D5)."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole option at state/disabled-opacity; it cannot be chosen."
business_rules:
  - "The option never chooses itself: the list that owns it writes selected and active."
  - "Without the value attribute, the value is the label text."
  - "The selected background wins over the active one."
domain_errors: []
tokens:
  padding: space/inline
  gap: space/inline
  radius: radius/inner
  label: "text/label-md in color/popover-foreground; color/accent-foreground when active"
  secondary: "text/label-md in color/muted-foreground, space/inline-tight after the label"
  icon: "nph-icon icon/size-md"
  avatar: "nph-avatar sm"
  dot: "space/inline square, radius/full, in an icon/size-md box; status/* or color/muted-foreground"
  active: "color/accent with color/accent-foreground"
  selected: "color/primary-surface with the check, icon/size-sm in color/primary"
  disabled: state/disabled-opacity
ai_hints:
  - "Write nph-option only as a child of the list that owns it, such as nph-select."
  - "Give every option of a list the same start."
  - "With start=dot, write the state in the label: the color only reinforces it."
  - "Set value when the label is translated or may change; the form reads the value."
  - "Never set selected or active by hand: set the value of the list."
accessibility:
  semantics: "Role option through ElementInternals, with aria-selected and aria-disabled; it writes no ARIA attribute on its own host."
  accessible_name: "The label text and the secondary text. The start, the dot and the check are hidden from the screen reader."
  keyboard:
    - "not_applicable: the option never takes the focus; the list that owns it handles the keyboard."
  focus: "not_applicable: the focus stays on the trigger of the list, which points to the active option with aria-activedescendant."
  contrast: "The label meets 4.5:1 on color/popover, color/accent and color/primary-surface, in light and dark mode; the check on color/primary-surface measures 4.78:1 and 6.26:1 (D8)."
  color_alternative: "The selected option has the check besides the background; the dot goes with the written state."
invalid_combinations:
  - "A start outside none, icon, avatar and dot — the option draws nothing."
  - "A status outside the six — the option draws nothing."
  - "An icon outside the core names — the option draws nothing."
  - "An option on its own, outside a list — it has no role there."
relations:
  combines_with: [nph-select, nph-icon, nph-avatar]
  parents: [nph-select]
  children: [nph-icon, nph-avatar]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the option on its own, outside a list."
  - "Putting a checkbox on the option."
  - "Mixing options with and without a start in the same list."
  - "Using the status dot without a written state."
  - "Setting selected or active by hand."
sources:
  design_md: "design.md, color/popover-foreground, color/accent, color/accent-foreground, color/primary-surface, color/primary, color/muted-foreground, status/*, text/label-md, radius/inner, radius/full, icon/size-md and state/disabled-opacity"
  decision: "P91 — API and semantics of nph-select and nph-option"
  tests: "src/components/nph-option/nph-option.test.ts and src/components/nph-select/nph-select.test.ts"
  usage_evidence: "the Option section of the nph-select Docs page"
  storybook: "src/components/nph-select/nph-select.stories.ts (the Option story) and nph-select.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, option 1357:136 of the nph-select set, in the nph-select frame 1357:160"
---

# nph-option

## Function

**The problem it solves:** gives a list the person picks from one option with its label and,
when needed, a start, a helper text and the selected look. It is shared: the list of
`nph-select` uses it, and the list of `nph-combobox` reuses it. It never stands alone; its
reading page is the one of `nph-select`.

**When to use:**

- As a child of `nph-select`, one per option of the list.
- With `start="dot"` when each option has a state, written in the label.
- With `secondary` when a helper text tells options with similar labels apart.

**When NOT to use:**

- **On its own, outside the list that owns it** — it has no role there.
- **With a checkbox marker** — multiple choice belongs to `nph-multi-combobox`.
- **Mixing options with and without a start in the same list** — use one start.
- **With the status dot and no state written in the label.**

## Variants

**By appearance:** the start — `none`, `icon`, `avatar` or `dot` — and the secondary text,
turned on by `secondary`.

**By size:** `not_applicable`: the option takes the width of the list; it measures 36 px, or
40 px with an avatar.

**By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| `start="none"` | General use |
| `start="icon"` | A symbol helps recognize the option |
| `start="avatar"` | The options are people |
| `start="dot"` | Each option has a state, written in the label |

**Do not combine with:** options with and without a start in the same list; a checkbox
marker.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/popover-foreground` | The label on the list background, with no background of its own |
| `hover` / active | `color/accent`, `color/accent-foreground` | The option the pointer or the keyboard is on (D5) |
| `selecionada` | `color/primary-surface`, `color/primary` | The chosen option, with the check; it wins over active (D5) |
| `disabled` | `state/disabled-opacity` | The whole option fades; it cannot be chosen. Selected and disabled keeps the selected look (D-3, open) |

**Feedback and focus:** the option never takes the focus; the list that owns it writes
`selected` and `active`, and points to the active option from its trigger.

**Business rule the piece carries:**

- The option never chooses itself: the list that owns it writes `selected` and `active`.
- Without the `value` attribute, the value is the label text.
- The selected background wins over the active one.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Role `option` through `ElementInternals`, with `aria-selected` and `aria-disabled`; it writes no ARIA attribute on its own host |
| Accessible name | The label text and the secondary text. The start, the dot and the check are hidden from the screen reader |
| Keyboard | `not_applicable`: the list that owns the option handles the keyboard |
| Focus | `not_applicable`: the focus stays on the trigger of the list, which points to the active option with `aria-activedescendant` |
| Contrast | The label meets 4.5:1 on `color/popover`, `color/accent` and `color/primary-surface`; the check on `color/primary-surface` measures 4.78:1 and 6.26:1 (D8) |
| Alternative to color | The selected option has the check besides the background; the dot goes with the written state |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-select`, the list that owns it; `nph-icon` and `nph-avatar`, in the
start and the check.

**What is the parent:** `nph-select`; later, `nph-combobox`. A list that owns options learns
that a property of an option changed through the `NPH_OPTION_CHANGED` symbol (P91).

**What is the child:** `nph-icon` and `nph-avatar`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Option | Padding and gap `space/inline`; radius `radius/inner`; the width of the list |
| Label | `text/label-md`, `color/popover-foreground`; `color/accent-foreground` when active; one line with an ellipsis (D3) |
| Secondary text | `text/label-md`, `color/muted-foreground`, `space/inline-tight` after the label; one line with an ellipsis (D3) |
| Icon | `nph-icon` `icon/size-md` |
| Avatar | `nph-avatar` `sm` |
| Dot | `space/inline` square, `radius/full`, in an `icon/size-md` box; `status/*`, `color/muted-foreground` for neutral, or the text color (D6) |
| Active | `color/accent`, `color/accent-foreground` |
| Selected | `color/primary-surface`; the check `icon/size-sm` in `color/primary` |
| Disabled | `state/disabled-opacity` |

**Usage restrictions:** `color/primary-surface` is the selected background only. The option
has no motion.

**AI hints:**

- Write `nph-option` only as a child of the list that owns it, such as `nph-select`.
- Give every option of a list the same start.
- With `start="dot"`, write the state in the label: the color only reinforces it.
- Set `value` when the label is translated or may change; the form reads the value.
- Never set `selected` or `active` by hand: set the value of the list.

## Examples

**Recommended case:** a department list, each option with its label and a technical `value`.

**Alternative case:** a list of people with `start="avatar"`, a photo and the role as
`secondary`; or a list of states with `start="dot"` and the state written in the label.

## Anti-patterns

- **Do not use the option on its own, outside a list.**
- **Do not put a checkbox on the option** — it belongs to `nph-multi-combobox`.
- **Do not mix options with and without a start in the same list.**
- **Do not use the status dot without a written state.**
- **Do not set `selected` or `active` by hand.**
- **Invalid combinations:** a `start` outside the four; a `status` outside the six; an `icon`
  outside the core.
- **Do not create without a decision:** a checkbox marker, groups, a color property, an event
  of its own or a `selected` attribute as the default of the list.

## Sources and decisions

- **The repository `design.md`:** `color/popover-foreground`, `color/accent`,
  `color/accent-foreground`, `color/primary-surface`, `color/primary`,
  `color/muted-foreground`, `status/*`, `text/label-md`, `radius/inner`, `radius/full`,
  `icon/size-md` and `state/disabled-opacity`.
- **The decision that originated it:** P91, the API and semantics of `nph-select` and
  `nph-option`.
- **Tests:** `src/components/nph-option/nph-option.test.ts` and
  `src/components/nph-select/nph-select.test.ts`.
- **Usage evidence:** the Option section of the `nph-select` Docs page.
- **Storybook:** the `Option` story in `src/components/nph-select/nph-select.stories.ts` and
  `nph-select.docs.stories.ts`.
- **Figma:** `nph-select / opção` (`1357:136`), in the `nph-select` frame (`1357:160`) of
  `DS-IA-NEPHOS 5.0`.
