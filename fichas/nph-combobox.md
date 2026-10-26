---
piece: nph-combobox
level: component
status: active
solves: >-
  Gives the person a field where typing filters a long list of options to pick one,
  and takes part in the form that contains it.
use_when:
  - "When the list is long and the person knows the name of what they look for: typing filters it."
  - "Inside an nph-field, which gives the label, the help text and the error message."
  - "With the status dot when each option has a state, written in the option text."
  - "With creatable only when the list accepts new items; with the shortcuts footer on screens used a lot by keyboard."
  - "default in most forms; large when the form uses tall fields."
do_not_use_when:
  - "For a short list that fits on the screen without search: use nph-select."
  - "To pick several options: use nph-multi-combobox."
  - "To offer create in a closed list: leave creatable off, and the list shows the nph-empty."
  - "To change the color of the arrow area: for an error, use invalid through nph-field."
  - "To use the status dot without a written state."
api:
  options:
    type: array
    required: true
    default: "empty list"
    reflects: false
    constraint: >-
      Property only. The entries of the list, in order: an option (type absent or option)
      with value and text, and optionally secondary, start, icon, src, status and
      disabled, which the combobox draws as an nph-option; a label (type label, with
      text) that names the group after it; and a separator (type separator) that closes
      a group. An invalid entry is left out, with one console.error per cause in
      development.
  size:
    type: enum
    values: [default, large]
    required: false
    default: default
    reflects: true
    constraint: >-
      The height of the field and the width of the arrow area: control/height-default
      or control/height-large. Any other value draws nothing and emits console.error in
      development.
  value:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The current value: the value of the chosen option. The value attribute is the
      initial value and the value of form.reset(), as in nph-input (P80). The chosen
      option is the first option with that value; the value is kept until such an
      option arrives. Setting it from code fires no event.
  query:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Property only. The typed text; empty while the field shows the chosen option.
      Setting it from code writes it in the field and filters the list, and fires no
      event. It is not the value: leaving the field without choosing clears it.
  placeholder:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The invitation before a choice, already localized, such as "Search a country".
      It is not a name.
  start:
    type: enum
    values: [search, icon, avatar]
    required: false
    default: search
    reflects: false
    constraint: >-
      The start of the field (the Figma `início`). search: the magnifying glass,
      decorative. icon: the icon of the chosen option when its own start is icon,
      otherwise the icon property. avatar: the photo of the chosen option when its own
      start is avatar, otherwise the empty avatar. Any other value draws nothing and
      emits console.error in development.
  icon:
    type: string
    required: false
    default: globe
    reflects: false
    constraint: >-
      A core name of nph-icon: the start icon with start=icon. Any name outside the core
      draws nothing and emits console.error in development.
  clearable:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The clear button (the Figma `limpar`): it shows with a chosen option or typed text,
      and erases both. It needs clear-label; without it, the button is not drawn and
      console.error is emitted in development.
  clear-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the clear button, already localized. Required with
      clearable.
  filter:
    type: enum
    values: [contains, none]
    required: false
    default: contains
    reflects: false
    constraint: >-
      contains: the list keeps the options whose text contains the typed text, with no
      difference of case or accent. none: the consumer filters options itself, as a
      search that answers from a server, with nph-search and loading. The highlight
      shows in both. Any other value draws nothing and emits console.error in
      development.
  loading:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The `carregando` list: the nph-spinner instead of the options, while the search
      answers. It needs loading-label; without it, the spinner has no name and
      console.error is emitted in development.
  loading-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the spinner, already localized, such as "Searching".
  creatable:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The `criar` list: after the results, a row offers the typed text as a new item,
      unless an option already says it. Only for a list that accepts new items. It needs
      create-label; without it, the row is not drawn and console.error is emitted in
      development.
  create-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The words of the create row before the typed text, already localized, such as
      "Create".
  empty-heading:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The title of the nph-empty when nothing matches (the `vazio` list). Empty: with
      nothing to show, the list does not open.
  empty-description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The description of the nph-empty when nothing matches.
  open:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The list is open. The piece opens and closes it; the consumer may set it. Opening
      and closing fire no event. A disabled combobox, or one with nothing to show, does
      not open.
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
      valueMissing, with the message of the browser. nph-field writes it.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity, on color/muted, out of the Tab order
      and of the form data; the list does not open and the clear button hides. A
      disabled fieldset disables it too. It wins over invalid.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error state: the border becomes status/error and the field gets aria-invalid.
      It is not a constraint of the form. The sentence belongs to nph-field.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name in text, never visible, for a combobox with no associated
      label; nph-field writes it. An associated label wins over it.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible description in text, never visible: the help or the error sentence
      that nph-field writes.
  shortcuts:
    type: "named slot"
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The `atalhos` footer of the list: the nph-kbd keys and their words, as the consumer
      writes them. An element in the slot turns the footer on (D-2).
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host when the person changes the value: a choice of a different
      option, the clear button or the create row. It bubbles and crosses shadow roots.
      Typing does not fire it: the native input of the inner field stays in the shadow
      root.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired by the host right after input. It bubbles. Setting value, query or open from
      code fires neither event.
  nph-search:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      detail.query: the typed text changed by the person, also when leaving the field
      clears it. It bubbles and crosses shadow roots. The consumer that filters searches
      with it.
  nph-create:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      detail.text: the person chose the create row. It fires before input and change;
      the value becomes the text, and the consumer adds the option to options.
variants:
  size:
    axis: size
    choose_when: "default in most forms; large when the form uses tall fields. One size per form."
    do_not_combine_with:
      - "default and large fields in the same form."
  start:
    axis: appearance
    choose_when: "search in general; icon when a symbol helps recognize the option; avatar when the options are people."
    do_not_combine_with:
      - "Options with and without a start in the same list."
states:
  default:
    token: color/input
    changes_for_user: "The resting border, on color/background, with the divider and the arrow area in color/accent."
  hover:
    token: color/input-hover
    changes_for_user: "The border goes one step darker under the pointer."
  focus:
    token: focus/border
    changes_for_user: "Focus on the text: the border takes focus/border with the focus/halo attached outside."
  open:
    token: focus/border
    changes_for_user: "The focus look with the list open below the field and the arrow up (chevron-up)."
  focus-clear:
    token: focus/border
    changes_for_user: "Keyboard focus on the clear button: the ring follows only the button; the field keeps its resting border."
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
  - "Typing opens the list, filters it and makes the first match active; Enter chooses it (D-5)."
  - "The person chooses by a click on an option, or by Enter or Alt+ArrowUp on the active option; the list closes, the field shows the option text and the focus stays on it."
  - "A change of the value by the person fires input and then change; choosing the option already chosen, Escape, Tab, a click outside and code fire nothing."
  - "Leaving the field without choosing gives it the text of the chosen option again; the typed text is never the value, except through the create row."
  - "Tab closes the list without choosing, and the focus moves on."
  - "Enter with the list closed submits the form; with the list open, it chooses."
  - "Escape closes the open list; with the list closed, it clears the typed text (D-4)."
  - "Disabled options are skipped by the keyboard and cannot be chosen."
  - "The create row shows only with creatable, with typed text that no option already says."
  - "disabled wins over invalid."
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
  text: "text/body-md in color/foreground; the placeholder in color/muted-foreground"
  start: "nph-icon icon/size-sm in color/muted-foreground, or nph-avatar sm"
  clear: "nph-icon xmark icon/size-sm with space/inline-tight around it"
  divider: "border/width in color/border"
  arrow_area: "color/accent, control/height-* wide, radius/none on the left and radius/control-inner on the right; the arrow icon/size-sm in color/muted-foreground"
  list: "color/popover, border/width in color/input, radius/container, elevation/dropdown, padding space/inline-tight, maximum height layout/max-list-height"
  list_offset: space/inline-tight
  highlight: "text/highlight-weight on the typed stretch; color/muted-foreground on the rest"
  group_label: "text/label-sm in color/muted-foreground, space/inline on the sides and space/inline-tight above and below"
  separator: "nph-separator with space/inline-tight above and below"
  footer: "border/width in color/border above, space/inline around, text/label-sm in color/muted-foreground"
  motion: "motion/enter-duration, motion/enter-easing, motion/exit-duration and motion/exit-easing; motion/hover-duration with reduced motion"
  focus: "focus/border, focus/halo, focus/halo-error, focus/ring-width, focus/radius-control and, on the clear button, focus/border-radius-control and focus/radius-control-with-border"
  disabled: state/disabled-opacity
ai_hints:
  - "Use nph-combobox for one choice in a long list the person searches by name; for a short list, nph-select; for several, nph-multi-combobox."
  - "Put nph-combobox inside nph-field, which gives the label, the help text and the error message."
  - "Give the options as data in options, never as children; one start for the whole list."
  - "For a search that answers from a server, set filter=none, listen to nph-search, set loading and then the new options."
  - "Turn creatable on only when the list accepts new items, and add the option on nph-create."
  - "Read the value from the host on input or change; read the typed text from nph-search or query."
  - "Never use the placeholder as the only name."
accessibility:
  semantics: "An editable combobox with list autocomplete (APG): the inner text field has role combobox, aria-autocomplete list, aria-expanded and aria-controls; the list has role listbox, the groups role group named by their label, and each nph-option role option with aria-selected. The host is form-associated and labelable."
  accessible_name: "From the label associated with the host, which the field and the list reference. Without one, from label. The placeholder is not a name. The clear button is named by clear-label. With no name at all, the combobox renders and warns in development."
  keyboard:
    - "Characters write in the field, open the list, filter it and make the first match active."
    - "Closed: ArrowDown and ArrowUp open on the chosen option, or on the first or the last; Alt+ArrowDown opens without moving; Enter submits the form; Escape clears the typed text."
    - "Open: ArrowDown and ArrowUp move without wrapping; PageDown and PageUp move ten options; Enter and Alt+ArrowUp choose the active option and close; Escape closes without choosing; Tab closes without choosing and the focus moves on."
    - "Home and End move the cursor in the text."
  focus: "The focus stays on the text; the active option is pointed to by aria-activedescendant, in the same shadow root. The field shows the focus border and the halo while it has the focus and while the list is open; the clear button has its own ring."
  contrast: "The text of the field and of the option meets 4.5:1 and the border 3:1, in light and dark mode; the arrow keeps 3:1 on color/accent; the rest of the text outside the highlight, in color/muted-foreground, passes 4.5:1. The disabled state is exempt."
  color_alternative: "The error is said by the sentence of nph-field; the dot goes with the written state; the highlight changes the weight of the text; the arrow turns up when the list opens."
invalid_combinations:
  - "A size outside default and large — the combobox draws nothing."
  - "A start outside search, icon and avatar — the combobox draws nothing."
  - "An icon outside the core names — the combobox draws nothing."
  - "A filter outside contains and none — the combobox draws nothing."
  - "clearable without clear-label — no clear button."
  - "creatable without create-label — no create row."
  - "invalid without the sentence in nph-field — red with no text."
relations:
  combines_with: [nph-field, nph-option, nph-empty, nph-spinner, nph-kbd, nph-separator, nph-icon, nph-avatar]
  parents: [nph-field, "form"]
  children: [nph-option, nph-empty, nph-spinner, nph-separator, nph-icon, nph-avatar]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using it for several options."
  - "Using it for a short list that fits on the screen without search."
  - "Offering create in a closed list."
  - "Changing the color of the arrow area: for an error, use invalid."
  - "Using the status dot without a written state."
  - "Writing the options as nph-option children of the combobox."
sources:
  design_md: "design.md, color/input, color/input-hover, color/accent, color/border, color/popover, color/primary-surface, status/*, focus/*, state/disabled-opacity, control/height-*, layout/input-width, layout/max-list-height, radius/control-inner, text/highlight-weight, elevation/dropdown and motion/*"
  decision: "P95 — API and semantics of nph-combobox and its list; the form pattern is P80, the field contract is P83, the option and the layer are P91"
  tests: "src/components/nph-combobox/nph-combobox.test.ts"
  usage_evidence: "the Examples section of the nph-combobox Docs page"
  storybook: "src/components/nph-combobox/nph-combobox.stories.ts and nph-combobox.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-combobox board 1359:142, documentation 1766:2400, set 1359:115, list 1359:141 and option 1357:136"
---

# nph-combobox

## Function

**The problem it solves:** gives the person a field where typing filters a long list of
options to pick one, and takes part in the form that contains it. The options are data, in
`options`; the combobox draws each one as an `nph-option`, the option shared with
`nph-select`, inside its own list. The label, the help and the error message belong to
`nph-field`; the combobox shows only the `erro` state.

**When to use:**

- When the list is long and the person knows the name of what they look for: typing filters
  it.
- Inside an `nph-field`, which gives the label, the help text and the error message.
- With the status dot when each option has a state, written in the option text.
- With `creatable` only when the list accepts new items; with the shortcuts footer on
  screens used a lot by keyboard.
- `default` in most forms; `large` when the form uses tall fields.

**When NOT to use:**

- **For a short list that fits on the screen without search** — use `nph-select`.
- **To pick several options** — use `nph-multi-combobox`.
- **To offer create in a closed list** — leave `creatable` off, and the list shows the
  `nph-empty`.
- **To change the color of the arrow area** — for an error, use `invalid` through
  `nph-field`.
- **To use the status dot without a written state.**

## Variants

**By appearance:** the start of the field, `search` (the magnifying glass), `icon` or
`avatar`. `icon` and `avatar` repeat the start of the chosen option; before a choice, `icon`
shows `globe` (or `icon`) and `avatar` the empty avatar.

**By size:** `default` (`control/height-default`) and `large` (`control/height-large`). The
height of the field and the width of the arrow area change.

**By density:** `not_applicable`.

| Variant | Choose when |
|---|---|
| `default` | Most forms |
| `large` | The form uses tall fields |
| `start="search"` | General use |
| `start="icon"` | A symbol helps recognize the option |
| `start="avatar"` | The options are people |

**Do not combine with:** `default` and `large` fields in the same form; options with and
without a start in the same list.

## States

| State | Token | What changes for the person |
|---|---|---|
| `default` | `color/input` | The resting border, on `color/background`, with the `color/border` divider and the arrow area in `color/accent` |
| `hover` | `color/input-hover` | The border goes one step darker under the pointer |
| `foco` | `focus/border`, `focus/halo` | Focus on the text: the border takes `focus/border`, with the halo attached outside |
| `aberto` | `focus/border`, `focus/halo` | The focus look with the list open below the field and the arrow up |
| `foco-limpar` | `focus/border`, `focus/halo` | Keyboard focus on the clear button: the ring follows only the button |
| `erro` | `status/error` | The border is `status/error`, also on hover |
| `erro-foco` | `status/error`, `focus/halo-error` | The border stays `status/error` and the halo is `focus/halo-error` |
| `disabled` | `state/disabled-opacity`, `color/muted` | The whole piece at `state/disabled-opacity` on `color/muted`, with the `color/input` border; it does not open |

**The list, by state:**

| State | What it shows |
|---|---|
| `resultados` | The options that match, as `nph-option` |
| `busca` | The typed stretch in `text/highlight-weight`; the rest of the text in `color/muted-foreground`, also on the active option (D-3) |
| `status` | Options with the dot of `nph-option` (`start="dot"`) and the written label |
| `grupos` | Results under group labels, with the `nph-separator` between groups, in the look of `nph-dropdown-menu` |
| `carregando` | The `nph-spinner`, named by `loading-label`, while the search answers |
| `criar` | After the results, an `nph-option` with the `plus` icon, `create-label` and the typed text in quotes (D-1) |
| `vazio` | The `nph-empty`, with `empty-heading` and `empty-description`, when nothing matches in a closed list |
| `atalhos` | The footer of the `shortcuts` slot, with a `color/border` line above (D-2) |

The list opens `space/inline-tight` below the field, with its width, and turns up when it
does not fit below and fits above, as the `nph-select` list (P91). It fades in and slides
into place with `motion/enter-*`, and leaves with `motion/exit-*`; with reduced motion, only
the opacity changes, in `motion/hover-duration`. The options sit inside
`layout/max-list-height`, with the border outside it, and scroll above that.

**Business rule the piece carries:**

- Typing opens the list, filters it and makes the first match active; Enter chooses it (D-5).
- The person chooses by a click on an option, or by Enter or Alt+ArrowUp on the active option;
  the list closes, the field shows the option text and the focus stays on it.
- A change of the value by the person fires `input` and then `change`; choosing the option
  already chosen, Escape, Tab, a click outside and code fire nothing.
- Leaving the field without choosing gives it the text of the chosen option again; the typed
  text is never the value, except through the create row.
- Tab closes the list without choosing, and the focus moves on.
- Enter with the list closed submits the form; with the list open, it chooses.
- Escape closes the open list; with the list closed, it clears the typed text (D-4).
- Disabled options are skipped by the keyboard and cannot be chosen.
- The create row shows only with `creatable`, with typed text that no option already says.
- `disabled` wins over `invalid`.

**Domain error states:** `invalid`, when the choice needs correction, such as a required field
with no choice. `nph-field` writes the sentence and passes it to the combobox as `description`.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | An editable combobox with list autocomplete (APG): the inner text field has role `combobox`, `aria-autocomplete="list"`, `aria-expanded` and `aria-controls`; the list has role `listbox`, each group role `group` named by its label, each `nph-option` role `option` and `aria-selected`. The host is form-associated and labelable |
| Accessible name | From the label associated with the host, which the field and the list reference. Without one, from `label`; `nph-field` writes it. The placeholder is not a name. The clear button is named by `clear-label` |
| Description | `description`, read when the field takes focus: the help or the error sentence of `nph-field` |
| Keyboard | Characters write, open, filter and activate the first match. Closed: ArrowDown and ArrowUp open on the chosen option, or the first or the last; Alt+ArrowDown opens without moving; Enter submits the form; Escape clears the typed text. Open: the arrows move without wrapping; PageDown and PageUp move ten; Enter and Alt+ArrowUp choose and close; Escape closes; Tab closes without choosing and the focus moves on. Home and End move the cursor |
| Focus | The focus stays on the text; the active option is pointed to by `aria-activedescendant`, in the same shadow root |
| Live region | The waiting and the empty lists sit in a `status` region: the person hears that the search found nothing |
| Contrast | The text meets 4.5:1 and the border 3:1, in light and dark mode; the arrow keeps 3:1 on `color/accent`; the rest of the text outside the highlight, in `color/muted-foreground`, passes 4.5:1. The disabled state is exempt |
| Alternative to color | The error is said by the sentence of `nph-field`; the dot goes with the written state; the highlight changes the weight; the arrow turns up when the list opens |
| Hidden parts | The start, the divider, the arrow, the dot and the check are hidden from the screen reader |
| Touch target | The whole field opens the list, arrow area included; the clear button has its own area, `icon/size-sm` with `space/inline-tight` around it |
| Known limits | Forced colors and right-to-left are not treated yet. The list does not shrink when neither side fits |

## Relations

**Combines with:** `nph-field`, which gives it the label, the help and the error;
`nph-option`, each option of the list; `nph-empty`, `nph-spinner` and `nph-separator`, in the
list; `nph-kbd`, in the shortcuts footer; `nph-icon` and `nph-avatar`, in the start, the clear
button and the arrow.

**What is the parent:** `nph-field`, or a form.

**What is the child:** `nph-option`, `nph-empty`, `nph-spinner` and `nph-separator` in the
list; `nph-icon` and `nph-avatar` in the field.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

**The list is shared:** `nph-multi-combobox` takes it from `nph-combobox.list.ts` — the
entries, the search, the groups, the highlight and the style — instead of building its own.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Field | Height `control/height-default` or `control/height-large`; width `layout/input-width`; radius `radius/control`; border `border/width`; left padding `space/control-padding`, right 0; gap `space/inline`; background `color/background` |
| Text | `text/body-md`, `color/foreground`; the placeholder in `color/muted-foreground` |
| Start | `nph-icon` `icon/size-sm` in `color/muted-foreground`, or `nph-avatar` `sm` |
| Clear | `nph-icon` `xmark` `icon/size-sm`, `space/inline-tight` around it |
| Divider | `border/width` in `color/border`, right before the arrow area |
| Arrow area | `color/accent`; `control/height-*` wide, the field height minus its two borders; `radius/none` on the left, `radius/control-inner` on the right; the arrow `icon/size-sm` in `color/muted-foreground` |
| List | `color/popover`; border `border/width` in `color/input`; `radius/container`; `elevation/dropdown`; padding `space/inline-tight`; maximum height `layout/max-list-height`, border outside it; offset `space/inline-tight` |
| Highlight | `text/highlight-weight` on the typed stretch; `color/muted-foreground` on the rest |
| Group label | `text/label-sm` in `color/muted-foreground`; `space/inline` on the sides, `space/inline-tight` above and below |
| Separator | `nph-separator`, `space/inline-tight` above and below |
| Footer | `border/width` in `color/border` above; `space/inline` around; `text/label-sm` in `color/muted-foreground` |
| Motion | `motion/enter-*` and `motion/exit-*`; with reduced motion, opacity only in `motion/hover-duration` |
| Focus | `focus/border`, `focus/halo`, `focus/halo-error`, `focus/ring-width`, `focus/radius-control`; on the clear button, `focus/border-radius-control` and `focus/radius-control-with-border` |
| Disabled | `state/disabled-opacity` on `color/muted` |

**Usage restrictions:** `color/accent` is the permanent background of the arrow area; do not
change it, also not for an error. `text/highlight-weight` goes only on the stretch that
repeats what the person typed. The width may stretch to the parent.

**AI hints:**

- Use `nph-combobox` for one choice in a long list the person searches by name; for a short
  list, `nph-select`; for several, `nph-multi-combobox`.
- Put `nph-combobox` inside `nph-field`, which gives the label, the help text and the error
  message.
- Give the options as data in `options`, never as children; one start for the whole list.
- For a search that answers from a server, set `filter="none"`, listen to `nph-search`, set
  `loading` and then the new `options`.
- Turn `creatable` on only when the list accepts new items, and add the option on
  `nph-create`.
- Read the value from the host on `input` or `change`; read the typed text from `nph-search`
  or `query`.
- Never use the placeholder as the only name.

## Examples

**Recommended case:** "Chosen option, at rest" — inside an `nph-field` with a label and help
text, the chosen country in the field, with the clear button.

**Alternative case:** "Search with the typed stretch highlighted" — the `busca` list open, the
typed stretch in `text/highlight-weight`. "Search waiting for the answer" — `filter="none"`
and `loading`, the `nph-spinner` in the list while the consumer searches.

## Anti-patterns

- **Do not use it for several options** — use `nph-multi-combobox`.
- **Do not use it for a short list** that fits on the screen without search — use
  `nph-select`.
- **Do not offer create in a closed list** — leave `creatable` off; the list shows the
  `nph-empty`.
- **Do not change the color of the arrow area** — for an error, use `invalid` through
  `nph-field`.
- **Do not use the status dot without a written state.**
- **Do not write the options as `nph-option` children** — the combobox draws them from
  `options`.
- **Invalid combinations:** a `size` outside the two; a `start` outside the three; an `icon`
  outside the core; a `filter` outside the two; `clearable` without `clear-label`;
  `creatable` without `create-label`; `invalid` without the sentence in `nph-field`.
- **Do not create without a decision:** multiple choice, a width property, a color property,
  an event for opening and closing, or a read-only state.

## Sources and decisions

- **The repository `design.md`:** `color/input`, `color/input-hover`, `color/accent`,
  `color/border`, `color/popover`, `color/primary-surface`, `status/*`, `focus/*`,
  `state/disabled-opacity`, `control/height-*`, `layout/input-width`,
  `layout/max-list-height`, `radius/control-inner`, `text/highlight-weight`,
  `elevation/dropdown` and `motion/*`.
- **The decision that originated it:** P95, the API and semantics of `nph-combobox` and its
  list; the form pattern is P80, the field contract is P83, and the option and the layer are
  P91.
- **Tests:** `src/components/nph-combobox/nph-combobox.test.ts`.
- **Usage evidence:** the Examples section of the `nph-combobox` Docs page.
- **Storybook:** `src/components/nph-combobox/nph-combobox.stories.ts` (Validation) and
  `nph-combobox.docs.stories.ts` (Docs).
- **Figma:** `nph-combobox` board (`1359:142`), documentation `1766:2400`, set `1359:115`,
  list `1359:141` and option `1357:136` in `DS-IA-NEPHOS 5.0`.
