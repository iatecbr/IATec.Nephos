---
piece: nph-option
level: component
status: active
solves: >-
  Gives a list the person picks from one option with its label and, when needed, a
  start, a helper text, a description and the selected look, shared by the lists of
  nph-select, nph-combobox and nph-multi-combobox.
use_when:
  - "As a child of nph-select, one per option of the list."
  - "With start=dot when each option has a state, written in the label."
  - "With secondary when a helper text tells options with similar labels apart."
  - "With rich and description when the label alone is not enough to choose: the rich option."
do_not_use_when:
  - "On its own, outside the list that owns it: it has no role there."
  - "With marker=checkbox outside nph-multi-combobox: the box is its multiple choice."
  - "Mixing options with and without a start in the same list: use one start."
  - "With the status dot and no state written in the label."
  - "With a long description: the list scrolls more; use a short sentence that changes the choice."
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
  marker:
    type: enum
    values: [check, checkbox]
    required: false
    default: check
    reflects: true
    constraint: >-
      check is the single choice: the selected option shows the check, with no background
      (DSA-124). checkbox is the multiple choice of nph-multi-combobox: an inert
      nph-checkbox at the start, checked while selected, with no selected background and
      no check (P96). Any other value draws nothing and emits console.error in
      development.
  rich:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      Turns on the rich look of the option: a description below the label, a softer hover
      that is a layer at select/option-background-hover-opacity, no selected background,
      and the parts aligned to the top (DSA-128). The focus border and halo of the list items
      are drawn by the plain option too, when active by the keyboard (DSA-124).
      It reflects because the internal CSS selects the look by it. The plain option is the
      default and does not change; a list may hold both, such as the create row of
      nph-combobox, which is plain.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text below the label of a rich option, already localized; it wraps and is the
      accessible description of the option. Empty turns it off. It is drawn only with rich.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The option cannot be chosen and the keyboard skips it; the whole option at
      state/disabled-opacity (select/option-disabled-opacity on the rich option).
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
  keyboard:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      Written by the list that owns the option, never by the consumer: the active option
      got there by the keyboard, not by the pointer. Only then the rich option draws the
      focus border and the halo. The list sets it from the last input: a key is the
      keyboard, a real pointer move is the pointer, and a pointer position the browser
      repeats after the list scrolled is not a move.
variants:
  start:
    axis: appearance
    choose_when: "icon when a symbol helps recognize the option; avatar when the options are people; dot when each option has a state; none in every other case."
    do_not_combine_with:
      - "Options with and without a start in the same list."
  rich:
    axis: appearance
    choose_when: "rich when the label alone is not enough to choose and a short description tells the options apart; plain in every other case."
    do_not_combine_with:
      - "A long description: the list scrolls more."
  marker:
    axis: appearance
    choose_when: "check in a list of one choice (nph-select, nph-combobox); checkbox in the list of several choices of nph-multi-combobox, which sets it."
    do_not_combine_with:
      - "checkbox in a list of one choice."
states:
  default:
    token: select/option-foreground
    changes_for_user: "The label in select/option-foreground on the list background, with no background of its own."
  active:
    token: select/option-background-hover
    changes_for_user: "The option the pointer or the keyboard is on: select/option-background-hover, with the text in select/option-foreground-hover (D5)."
  selected:
    token: select/option-marker
    changes_for_user: "The chosen option: only the check in select/option-marker, with no background (DSA-124). Active or not, it has no hover look: only the focus ring when active by the keyboard. With marker=checkbox, the checked box instead, and the hover look stays (P96)."
  keyboard_active:
    token: "select/option-focus-border and select/option-focus-halo"
    changes_for_user: "The plain option active by the keyboard: the hover look (a selected option with the check has none), a 1 px focus border outside the option and a halo outside it (DSA-124). The pointer hover has no border."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole option at state/disabled-opacity; it cannot be chosen."
  rich_hover_and_active:
    token: "select/option-background-hover at select/option-background-hover-opacity"
    changes_for_user: "The rich option: a layer under the content, softer than the plain option; the label stays select/option-foreground-hover."
  rich_keyboard_active:
    token: "select/option-focus-border and select/option-focus-halo"
    changes_for_user: "The rich option active by the keyboard: the layer, a focus border outside the option and a halo outside it. The pointer hover has no border."
  rich_selected:
    token: "select/option-marker"
    changes_for_user: "The chosen rich option has no background: the check, or the checked box with marker=checkbox. In hover or active it takes the same layer and keeps the check."
  rich_disabled:
    token: select/option-disabled-opacity
    changes_for_user: "The whole rich option fades; the secondary text and the description take select/option-foreground; with marker=checkbox the box stays at its default and only the option opacity applies."
business_rules:
  - "The option never chooses itself: the list that owns it writes selected and active."
  - "Without the value attribute, the value is the label text."
  - "The selected option has no background, plain or rich; the check says the choice."
  - "With marker=checkbox, the checked box says the choice, without the selected background."
  - "The rich look is a choice of the option, not of the list: rich turns it on, and the plain option next to it does not change."
  - "The rich option has no selected background, whatever the marker."
  - "Only the option active by the keyboard, plain or rich, draws the focus border and the halo; the list tells the option with keyboard."
domain_errors: []
tokens:
  padding: space/inline
  gap: space/inline
  radius: radius/inner
  label: "text/label-md in select/option-foreground; select/option-foreground-hover when active"
  secondary: "text/label-md in select/option-secondary-foreground, space/inline-tight after the label"
  icon: "nph-icon icon/size-md"
  avatar: "nph-avatar sm"
  dot: "space/inline square, radius/full, in an icon/size-md box; status/* or color/muted-foreground"
  active: "select/option-background-hover with select/option-foreground-hover"
  selected: "no background; the check, icon/size-sm in select/option-marker"
  keyboard_active: "select/option-focus-border of select/option-focus-border-width, then select/option-focus-halo of select/option-focus-halo-width, both outside the option; select/option-focus-border-radius and select/option-focus-halo-radius"
  checkbox: "nph-checkbox, inert, at the start of the option (marker=checkbox)"
  disabled: state/disabled-opacity
  rich_padding_gap_radius: "select/option-padding, select/option-gap, select/option-radius"
  rich_label: "text/label-md in select/option-foreground; select/option-foreground-hover when active"
  rich_secondary: "text/label-md in select/option-secondary-foreground, select/option-label-gap after the label"
  rich_description: "text/caption in select/option-description-foreground, select/option-text-gap below the label line; it wraps"
  rich_hover: "select/option-background-hover at select/option-background-hover-opacity, a layer under the content"
  rich_focus: "select/option-focus-border of select/option-focus-border-width, then select/option-focus-halo of select/option-focus-halo-width, both outside the option"
  rich_marker: "select/option-marker, select/option-marker-size"
  rich_start: "select/option-icon-size; the dot select/option-dot-size"
  rich_disabled: select/option-disabled-opacity
ai_hints:
  - "Write nph-option only as a child of the list that owns it, such as nph-select."
  - "Give every option of a list the same start."
  - "With start=dot, write the state in the label: the color only reinforces it."
  - "Set value when the label is translated or may change; the form reads the value."
  - "Never set selected, active or keyboard by hand: set the value of the list."
  - "Write rich and description on the option for the rich option; give a short description that changes the choice."
  - "Do not write nph-rich-option inside a list: the card is the form choice, the rich option is nph-option with rich."
accessibility:
  semantics: "Role option through ElementInternals, with aria-selected and aria-disabled; it writes no ARIA attribute on its own host."
  accessible_name: "The label text and the secondary text. The start, the dot, the check and the box of marker=checkbox are hidden from the screen reader. On a rich option the description is the accessible description of the option (aria-description through ElementInternals) and its line is hidden from the screen reader."
  keyboard:
    - "not_applicable: the option never takes the focus; the list that owns it handles the keyboard."
  focus: "not_applicable: the focus stays on the trigger of the list, which points to the active option with aria-activedescendant. The rich option active by the keyboard draws the focus border and the halo of the list items."
  contrast: "The label meets 4.5:1 on color/popover and color/accent, in light and dark mode (D8). The check in color/primary on color/popover measures 5.37:1 in light and 3.91:1 in dark (default brand, measured in DSA-124)."
  color_alternative: "The selected option has no background: the check or the checked box says it; the dot goes with the written state."
invalid_combinations:
  - "A start outside none, icon, avatar and dot — the option draws nothing."
  - "A status outside the six — the option draws nothing."
  - "An icon outside the core names — the option draws nothing."
  - "A marker outside check and checkbox — the option draws nothing."
  - "An option on its own, outside a list — it has no role there."
  - "A description without rich — it is not drawn."
relations:
  combines_with: [nph-select, nph-combobox, nph-multi-combobox, nph-icon, nph-avatar, nph-checkbox]
  parents: [nph-select, nph-combobox, nph-multi-combobox]
  children: [nph-icon, nph-avatar, nph-checkbox]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the option on its own, outside a list."
  - "Putting marker=checkbox on the option of a list of one choice."
  - "Mixing options with and without a start in the same list."
  - "Using the status dot without a written state."
  - "Setting selected, active or keyboard by hand."
  - "A long description on the rich option."
  - "Writing nph-rich-option inside a list."
sources:
  design_md: "design.md, color/popover-foreground, color/accent, color/accent-foreground, color/primary, select/option-focus-*, color/muted-foreground, status/*, text/label-md, radius/inner, radius/full, icon/size-md and state/disabled-opacity"
  decision: "P91 — API and semantics of nph-select and nph-option; P96 amends it with marker; P134 adds the rich look"
  tests: "src/components/nph-option/nph-option.test.ts, nph-option.rich.test.ts, src/components/nph-rich-option/nph-rich-option.lists.test.ts and src/components/nph-select/nph-select.test.ts"
  usage_evidence: "the Option section of the nph-select Docs page"
  storybook: "src/components/nph-select/nph-select.stories.ts (the Option story) and nph-select.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, option 1357:136 of the nph-select set, in the nph-select frame 1357:160"
---

# nph-option

## Function

**The problem it solves:** gives a list the person picks from one option with its label and,
when needed, a start, a helper text, a description and the selected look. It is shared: the list of
`nph-select` uses it, and the lists of `nph-combobox` and `nph-multi-combobox` reuse it. It
never stands alone; its reading page is the one of `nph-select`.

**When to use:**

- As a child of `nph-select`, one per option of the list.
- With `start="dot"` when each option has a state, written in the label.
- With `secondary` when a helper text tells options with similar labels apart.
- With `rich` and `description` when the label alone is not enough to choose: the rich
  option.

**When NOT to use:**

- **On its own, outside the list that owns it** — it has no role there.
- **With `marker="checkbox"` outside `nph-multi-combobox`** — the box is its multiple
  choice.
- **Mixing options with and without a start in the same list** — use one start.
- **With the status dot and no state written in the label.**
- **With a long description** — the list scrolls more; use a short sentence that changes the
  choice.

## Variants

**By appearance:** the start — `none`, `icon`, `avatar` or `dot` — the secondary text,
turned on by `secondary`, and the rich look, turned on by `rich`.

**By size:** `not_applicable`: the option takes the width of the list; it measures 36 px, or
40 px with an avatar. The rich option aligns its parts to the top: the start icon, the dot,
the texts and the check drop by `select/option-content-offset` (2 px), so the first line
centers on the 24 px avatar or checkbox, which stay at the top. It measures 38 px with an icon
or a dot and no description, and 40 px with an avatar or a checkbox. It grows with its
description: the offset, the label line, a gap and the caption line, which wraps (58 px with
one line of description).

**By density:** `not_applicable`.

**Marker:** `check`, the single choice, or `checkbox`, the multiple choice
of `nph-multi-combobox`, which sets it on its options (P96). With `checkbox`, the option
measures 40 px, the touch area of the `nph-checkbox`.

| Variant | Choose when |
|---|---|
| `start="none"` | General use |
| `start="icon"` | A symbol helps recognize the option |
| `start="avatar"` | The options are people |
| `start="dot"` | Each option has a state, written in the label |
| `rich` | A short description tells the options apart and the label alone is not enough |

**The rich option.** The rich look is the option with `rich`; it has no tag of its own. It is
a choice of the option, not of the list, so one list may hold both looks, and the plain
option keeps the look it has. `description` is the text below the label line; with `rich` and
no description the option is the rich look with no second line. It differs from the plain
option in four things:

- the hover is a layer under the content at the opacity `select/option-background-hover-opacity`
  (the layer takes the opacity, never the whole option);
- the selected option has no background: the check, or the checked box with
  `marker="checkbox"`, says the choice, and in hover or active it takes the same layer;
- the option active **by the keyboard** draws a 1 px focus border outside the option and a 4 px
  halo outside that border, the focus of the list items of `nph-dropdown-menu`; the pointer
  hover has none;
- the description wraps, in `text/caption`.

**Do not combine with:** options with and without a start in the same list;
`marker="checkbox"` in a list of one choice.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `select/option-foreground` | The label on the list background, with no background of its own |
| `hover` / active | `select/option-background-hover`, `select/option-foreground-hover` | The option the pointer or the keyboard is on (D5) |
| `selecionada` | `select/option-marker` | The chosen option: only the check, with no background (DSA-124). Active or not, it has no hover look. With `marker="checkbox"`, the checked box instead, and the hover look stays (P96) |
| `ativa` by the keyboard | `select/option-focus-border`, `select/option-focus-halo` | The hover look, a 1 px focus border outside the option and the halo outside it; the active option sits over its neighbors. The pointer hover has no border (DSA-124) |
| `disabled` | `state/disabled-opacity` | The whole option fades; it cannot be chosen. Selected and disabled keeps the selected look (D-3, open) |

The same states of the rich option, with the tokens of the rich look:

| State | Token | What changes for the person |
|---|---|---|
| Hover / active | `select/option-background-hover` at `select/option-background-hover-opacity`, label in `select/option-foreground-hover` | The layer under the content, softer than the plain option |
| Active by the keyboard | `select/option-focus-border`, `select/option-focus-halo` | The layer, the focus border outside the option and the halo outside it; the active option sits over its neighbors |
| Selected | `select/option-marker` | No background: the check, or the checked box. In hover or active, the same layer, and the border and halo when active by the keyboard |
| Disabled | `select/option-disabled-opacity` | The whole option fades; the secondary text and the description take `select/option-foreground`; with `marker="checkbox"` the box stays at its default and only the option opacity applies. The list skips it |

**Feedback and focus:** the option never takes the focus; the list that owns it writes
`selected`, `active` and `keyboard`, and points to the active option from its trigger. The
list sets `keyboard` from the last input: a key press is the keyboard, a real pointer move is
the pointer, and a pointer position the browser repeats after the list scrolled is not a
move. The halo reaches 5 px outside the option, so it lies over the neighbors and the active
option sits above them; at the edge of the list, the scroll box clips the outer pixel of the
halo, and that clip stays.

**Business rule the piece carries:**

- The option never chooses itself: the list that owns it writes `selected` and `active`.
- Without the `value` attribute, the value is the label text.
- The selected option has no background, plain or rich; the check says the choice.
- With `marker="checkbox"`, the checked box says the choice, without the selected background.
- The rich look is a choice of the option: `rich` turns it on, and the plain option next to it
  does not change.
- The rich option has no selected background, whatever the marker.
- Only the option active by the keyboard, plain or rich, draws the focus border and the halo.

**Domain error states:** `not_applicable`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Role `option` through `ElementInternals`, with `aria-selected` and `aria-disabled`; it writes no ARIA attribute on its own host |
| Accessible name | The label text and the secondary text. The start, the dot, the check and the box of `marker="checkbox"` are hidden from the screen reader; the box is also `inert`. On a rich option the description is the accessible description of the option, through `ElementInternals` because an id does not cross a shadow root, and its line is hidden from the screen reader |
| Keyboard | `not_applicable`: the list that owns the option handles the keyboard |
| Focus | `not_applicable`: the focus stays on the trigger of the list, which points to the active option with `aria-activedescendant`. The rich option active by the keyboard draws a 1 px `select/option-focus-border` and a 4 px `select/option-focus-halo` outside it; the layer alone is below 3:1 and the border meets it |
| Contrast | The label meets 4.5:1 on `color/popover` and `color/accent` (D8). The check in `color/primary` on `color/popover` measures 5.37:1 in light and 3.91:1 in dark (default brand, DSA-124) |
| Alternative to color | The selected option has no background: the check or the checked box says it; the dot goes with the written state |
| Known limits | Forced colors and right-to-left are not treated yet |

## Relations

**Combines with:** `nph-select`, `nph-combobox` and `nph-multi-combobox`, the lists that own
it; `nph-icon` and `nph-avatar`, in the start and the check; `nph-checkbox`, the box of
`marker="checkbox"`.

**What is the parent:** `nph-select`, `nph-combobox` and `nph-multi-combobox`. A list that owns options learns
that a property of an option changed through the `NPH_OPTION_CHANGED` symbol (P91).

**What is the child:** `nph-icon`, `nph-avatar` and `nph-checkbox`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Option | Padding and gap `space/inline`; radius `radius/inner`; the width of the list |
| Label | `text/label-md`, `select/option-foreground`; `select/option-foreground-hover` when active; one line with an ellipsis (D3) |
| Secondary text | `text/label-md`, `select/option-secondary-foreground`, `space/inline-tight` after the label; one line with an ellipsis (D3) |
| Icon | `nph-icon` `icon/size-md` |
| Avatar | `nph-avatar` `sm` |
| Dot | `space/inline` square, `radius/full`, in an `icon/size-md` box; `status/*`, `color/muted-foreground` for neutral, or the text color (D6) |
| Active | `select/option-background-hover`, `select/option-foreground-hover` |
| Selected | No background; the check `icon/size-sm` in `select/option-marker` |
| Keyboard focus | `select/option-focus-border` of `select/option-focus-border-width`, then `select/option-focus-halo` of `select/option-focus-halo-width`, both outside the option |
| Box | `nph-checkbox`, inert, at the start, with `marker="checkbox"` |
| Disabled | `state/disabled-opacity` |
| Rich option | `select/option-padding`, `select/option-gap`, `select/option-radius`; label `text/label-md` in `select/option-foreground`, in `select/option-foreground-hover` when active; secondary `select/option-secondary-foreground`, `select/option-label-gap` after the label |
| Rich description | `text/caption` in `select/option-description-foreground`, `select/option-text-gap` below the label line |
| Rich hover and active | `select/option-background-hover` at `select/option-background-hover-opacity`, a layer under the content |
| Rich keyboard focus | `select/option-focus-border` of `select/option-focus-border-width`, then `select/option-focus-halo` of `select/option-focus-halo-width`, both outside the option |
| Rich check, start and dot | `select/option-marker` in `select/option-marker-size`; `select/option-icon-size`; the dot `select/option-dot-size` |
| Rich disabled | `select/option-disabled-opacity` |

**Usage restrictions:** neither the plain nor the rich option has a selected background: the
check says the choice (DSA-124). The option has no motion.

**AI hints:**

- Write `nph-option` only as a child of the list that owns it, such as `nph-select`.
- Give every option of a list the same start.
- With `start="dot"`, write the state in the label: the color only reinforces it.
- Set `value` when the label is translated or may change; the form reads the value.
- Never set `selected`, `active` or `keyboard` by hand: set the value of the list.
- Write `rich` and `description` on the option for the rich option; give a short description
  that changes the choice.
- Do not write `nph-rich-option` inside a list: the card is the form choice, and the rich
  option is `nph-option` with `rich`.

## Examples

**Recommended case:** a department list, each option with its label and a technical `value`.

**Alternative case:** a list of people with `start="avatar"`, a photo and the role as
`secondary`; or a list of states with `start="dot"` and the state written in the label.

**The rich option:** a plan list in `nph-select`, each option with `rich` and a short
`description` of what the plan includes; or people in `nph-combobox`, with `start="avatar"`,
`rich` and a support line.

## Anti-patterns

- **Do not use the option on its own, outside a list.**
- **Do not put `marker="checkbox"` on the option of a list of one choice** — the box is the
  multiple choice of `nph-multi-combobox`.
- **Do not mix options with and without a start in the same list.**
- **Do not use the status dot without a written state.**
- **Do not set `selected`, `active` or `keyboard` by hand.**
- **Do not put a long description on the rich option** — the list scrolls more.
- **Do not write `nph-rich-option` inside a list.**
- **Invalid combinations:** a `start` outside the four; a `status` outside the six; an `icon`
  outside the core; a `marker` outside the two; a `description` without `rich`, which is not
  drawn.
- **Do not create without a decision:** groups, a color property, an event
  of its own or a `selected` attribute as the default of the list.

## Sources and decisions

- **The repository `design.md`:** `color/popover-foreground`, `color/accent`,
  `color/accent-foreground`, `color/primary`, `select/option-focus-*`,
  `color/muted-foreground`, `status/*`, `text/label-md`, `radius/inner`, `radius/full`,
  `icon/size-md` and `state/disabled-opacity`.
- **The decision that originated it:** P91, the API and semantics of `nph-select` and
  `nph-option`; P96 amends it with `marker`; P134 adds the rich look.
- **Tests:** `src/components/nph-option/nph-option.test.ts`, `nph-option.rich.test.ts`,
  `src/components/nph-rich-option/nph-rich-option.lists.test.ts` and
  `src/components/nph-select/nph-select.test.ts`.
- **Usage evidence:** the Option section of the `nph-select` Docs page.
- **Storybook:** the `Option` story in `src/components/nph-select/nph-select.stories.ts` and
  `nph-select.docs.stories.ts`.
- **Figma:** `nph-select / opção` (`1357:136`), in the `nph-select` frame (`1357:160`) of
  `DS-IA-NEPHOS 5.0`; the rich option, `nph-select / opção rica` (`6910:7093`), in the
  `nph-rich-option` documentation frame (`6935:11785`).
