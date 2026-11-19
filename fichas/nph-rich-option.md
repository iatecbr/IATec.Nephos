---
piece: nph-rich-option
level: component
status: active
solves: >-
  Gives a form choice a title and a short explanation of its consequence, with the whole
  card as the click area: a checkbox, a radio or a switch at its start, an optional icon and
  an optional shortcut. The same rich look, with a description below the label, is the
  rich option of the nph-select and nph-combobox list.
use_when:
  - "When each choice of a form needs a sentence that explains the consequence, such as a plan or a delivery method."
  - "With control radio, for one choice among two to five that exclude each other."
  - "With control checkbox, for several independent choices, each with its explanation."
  - "With control switch, to turn a feature on or off with an immediate effect."
  - "As the rich option of a list, with rich on nph-option, when the label alone is not enough to choose."
do_not_use_when:
  - "For a simple list of choices with no explanation: use nph-radio or nph-checkbox."
  - "To mix controls in the same group: use only radios, only boxes or only switches."
  - "With a shortcut on a card with a switch: the switch already acts on click."
  - "For more than five exclusive choices: use nph-select, or nph-combobox above fifteen."
  - "For an action that needs a button: the card chooses, it never runs a command."
api:
  control:
    type: enum
    values: [checkbox, radio, switch]
    required: false
    default: checkbox
    reflects: true
    constraint: >-
      The control the card holds, the Figma property `controle`. It reflects because the internal
      CSS and the radio group read it. checkbox for several choices, radio for one
      choice, switch for an on and off with an immediate effect. Any other value draws
      nothing and emits console.error in development.
  checked:
    type: boolean
    required: false
    default: "false"
    reflects: false
    constraint: >-
      The current state, the Figma property `marcado`. The checked attribute is the initial state
      and the one form.reset() returns to; a later change of the attribute moves the
      current state only while neither the person nor code changed checked. Setting it
      from code unchecks the other cards of a radio group and fires no event. Checked
      changes only the control: the outline of the card does not change.
  name:
    type: string
    required: false
    default: "empty"
    reflects: true
    constraint: >-
      The group of a radio card and the key in the form. Radio cards with the same
      non-empty name, in the same root and with the same form owner, are one group. It
      reflects because the form reads the attribute of the host; an empty name writes
      no attribute. Without a name, a radio card is a group of one.
  value:
    type: string
    required: false
    default: "on"
    reflects: true
    constraint: >-
      What a checked checkbox or radio card submits, under name. The default, on, is
      also written as the attribute. A card with a switch is not a form member and
      submits nothing, as nph-switch does; a card that is not drawn submits nothing.
  text:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The title, already localized; it is also the accessible name of the control, and it
      wraps. Without it the card draws nothing and emits console.error in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The second line, already localized: the consequence of the choice. It is the
      accessible description of the control. Empty turns it off.
  icon:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      A core name of nph-icon, drawn light in an icon/size-md box after the control, in
      the color of the title. Empty turns it off. A name outside the core draws nothing
      and emits console.error in development.
  shortcut:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The keys of the shortcut hint, separated by spaces, each one in an nph-kbd at the
      end of the card. Empty turns it off. It is only a hint: the card binds no key. Never
      with control switch, which draws nothing and emits console.error in development.
  keyShortcuts:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The aria-keyshortcuts value, such as Meta+K (the attribute is key-shortcuts), written only when the product binds the
      key and calls the same action as the click. A disabled card announces none. Binding
      the key, and when it works, is the product's call.
  invalid:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The error outline. Visual only: aria-invalid is not supported on the radio and
      switch roles, and the sentence that says what to fix is the error message of the
      nph-field of the group. nph-field writes it on every card of the group. disabled
      wins over it.
  disabled:
    type: boolean
    required: false
    default: "false"
    reflects: true
    constraint: >-
      The whole card at rich-option/disabled-opacity, out of the Tab order and the arrow
      keys, with no click. A disabled fieldset around the card does the same. It wins
      over invalid.
  input:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native input event, fired on the host when the person checks or toggles the
      card: it bubbles and crosses the shadow root. Read event.target.checked. A change
      from code never fires it.
  change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      The native change event, fired on the host right after input, when the person checks
      or toggles the card: it bubbles and does not cross the shadow root. A change from
      code never fires it.
variants:
  control:
    axis: appearance
    choose_when: "radio for one choice among a few that need an explanation; checkbox for several independent choices; switch for an on and off with an immediate effect."
    do_not_combine_with:
      - "Another control in the same group."
      - "A shortcut, with the switch."
  description:
    axis: appearance
    choose_when: "On by default: a short sentence with the consequence of the choice. Off only when the title alone says everything."
    do_not_combine_with: []
  icon:
    axis: appearance
    choose_when: "When a symbol helps the person recognize the choice. Off by default."
    do_not_combine_with: []
  shortcut:
    axis: appearance
    choose_when: "When the product binds a key to the choice and wants it visible. Off by default."
    do_not_combine_with:
      - "The switch."
states:
  default:
    token: "rich-option/background, rich-option/border"
    changes_for_user: "The card with its resting outline, inside the card, and the control at its default."
  checked:
    token: "the control; rich-option/border"
    changes_for_user: "Only the control changes: the outline stays rich-option/border, and the choice reads by the control."
  hover:
    token: "rich-option/background-hover at rich-option/background-hover-opacity"
    changes_for_user: "A layer under the content, with the corner of the card; the outline does not change. The control does not take its own hover from the card."
  focus:
    token: "rich-option/focus-border, rich-option/focus-halo, rich-option/focus-ring-width, rich-option/focus-radius"
    changes_for_user: "Keyboard only: the outline turns rich-option/focus-border and the halo shows outside the card. The control inside takes no ring of its own."
  error:
    token: "rich-option/border-error; with focus, rich-option/focus-halo-error"
    changes_for_user: "The outline turns rich-option/border-error, checked or not; the control stays at default. With focus the outline stays the error one and the halo is the error one."
  disabled:
    token: rich-option/disabled-opacity
    changes_for_user: "The whole card loses opacity and stops responding. Checked keeps the checked control; error is not shown."
business_rules:
  - "The whole card is the click area: a click anywhere on it checks a radio card or toggles a checkbox or switch card."
  - "The card holds the role, the state and the focus; the control inside is a visual indicator, inert and hidden from the screen reader."
  - "Radio cards with the same name and the same form owner, in the same root, are one group: checking one unchecks the others, one Tab stop per group, and the arrow keys move the focus and check, wrapping."
  - "Space checks a radio card and toggles a checkbox or switch card. Enter checks nothing on a checkbox or radio card, as nph-checkbox and nph-radio, and toggles a switch card, as nph-switch; it does not submit the form."
  - "Only the person checking or toggling the card fires input and change; setting checked from code never fires them."
  - "Only a checked checkbox or radio card enters the form, as name=value; a switch card is not a form member."
  - "The shortcut is a hint: the card binds no key and sets aria-keyshortcuts only when keyShortcuts says the key is bound."
  - "Hover only adds the layer: it never changes the outline. Error with hover keeps the error outline, focus with hover keeps the focus outline and the halo, and a disabled card takes no hover."
domain_errors:
  - "invalid: the group failed validation. Every card shows the rich-option/border-error outline; the sentence that says what to fix is the error message of nph-field."
tokens:
  card: "rich-option/padding, rich-option/gap, rich-option/radius, rich-option/background, layout/rich-option-width"
  outline: "rich-option/border-width inside, rich-option/border; error rich-option/border-error; focus rich-option/focus-border"
  title: "text/label-md in rich-option/foreground"
  description: "text/caption in rich-option/description-foreground, rich-option/text-gap below the title"
  icon: "nph-icon light in a rich-option/icon-size box, rich-option/foreground"
  control: "nph-checkbox, nph-radio or nph-switch at the default size, inert"
  shortcut: "nph-kbd"
  hover: "rich-option/background-hover at rich-option/background-hover-opacity, a layer under the content"
  focus: "rich-option/focus-border, rich-option/focus-halo, rich-option/focus-halo-error, rich-option/focus-ring-width, rich-option/focus-radius"
  disabled: rich-option/disabled-opacity
ai_hints:
  - "Use nph-rich-option when each choice needs a sentence that explains it; for a simple list, use nph-radio or nph-checkbox."
  - "Use one control type per group: radio for one choice among two to five, checkbox for several, switch for an on and off."
  - "Put the cards of a group inside an nph-field, which names the group and carries the error message; give the radio cards the same name and each one its value."
  - "Write the title as the choice and description as the consequence, both already localized."
  - "Read the choice from event.target.checked and event.target.value on change; do not listen to click."
  - "Put checked on the default card; it is also the state the form returns to on reset."
  - "Set invalid on every card of the group together with the error message of nph-field; never leave a card red without a sentence."
  - "Do not put shortcut on a card with a switch, and set keyShortcuts only when the product binds the key."
  - "For the rich option of a list, write rich and description on the nph-option; never write nph-rich-option inside a list."
accessibility:
  semantics: "The host is the control: role checkbox, radio or switch, with aria-checked and aria-disabled, through ElementInternals. The control drawn inside is inert and aria-hidden. A group of radio cards inside nph-field is read as a group: see the known limits."
  accessible_name: "The title is the name of the control (aria-label through the internals, because an id does not cross a shadow root) and the second line is its description (aria-description). The icon, the second line and the shortcut are hidden from the screen reader."
  keyboard:
    - "Radio: Tab enters the group on the checked card or, with none checked, on the first one that responds; the next Tab leaves the group."
    - "Radio: arrow down and arrow right move to the next card and check it, wrapping; arrow up and arrow left, to the previous one."
    - "Checkbox and switch: each card is one Tab stop, and the arrows do nothing."
    - "Space checks a radio card and toggles a checkbox or switch card."
    - "Enter checks nothing on a checkbox or radio card and toggles a switch card, following the control held; it does not submit the form."
    - "A disabled card is out of the Tab order and the arrow keys skip it."
  focus: "Keyboard only: the outline turns rich-option/focus-border and a halo of rich-option/focus-ring-width shows outside the card; the control inside takes no ring. A mouse click does not show it."
  contrast: "The title 19.56:1 in light and 12.45:1 in dark over rich-option/background, the second line 6.69:1 and 8.28:1. The resting outline is decorative; the boundary that meets 3:1 is the control inside. Known limit: in light mode of the default brand, focus/border measures 2.92:1 against the halo, as design.md records."
  color_alternative: "The control says the choice, never the outline; the error has the sentence of nph-field."
invalid_combinations:
  - "A control outside checkbox, radio and switch — the card draws nothing."
  - "An icon outside the core names — the card draws nothing."
  - "A shortcut with the switch — the card draws nothing."
  - "No text — the card draws nothing."
  - "invalid with disabled — disabled wins: the error outline is not shown, and it is not a console error."
  - "A radio card without name, or alone in its group — it renders as a group of one."
relations:
  combines_with: [nph-field, nph-checkbox, nph-radio, nph-switch, nph-icon, nph-kbd, nph-option, nph-select, nph-combobox]
  parents: [nph-field, form]
  children: [nph-checkbox, nph-radio, nph-switch, nph-icon, nph-kbd]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the card for a simple list of choices with no explanation."
  - "Mixing controls in the same group."
  - "A shortcut on a card with a switch."
  - "Treating the shortcut as a binding: the card binds no key."
  - "A red card without a sentence that explains the error."
  - "Painting the outline of the checked card: the control says the choice."
  - "Writing nph-rich-option inside a list: the rich option of a list is nph-option with rich."
sources:
  design_md: "design.md, the rich-option/* tokens, layout/rich-option-width, core opacity 50, color/border-subtle, color/primary-border and the use of the semantics they alias"
  decision: "P134 — nph-rich-option and the rich option: API and semantics; P81, P82 and P79 for the three controls; P83 for the field contract"
  tests: "src/components/nph-rich-option/nph-rich-option.test.ts, nph-rich-option.lists.test.ts and src/components/nph-option/nph-option.rich.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-rich-option/nph-rich-option.stories.ts and nph-rich-option.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-rich-option documentation frame 6935:11785, card set 6910:6828 and rich option set 6910:7093"
---

# nph-rich-option

## Function

**The problem it solves:** gives a form choice a title and a short explanation of its
consequence, and makes the whole card the click area. A checkbox, a radio or a switch sits at
its start, then an optional icon, the title, the second line and an optional shortcut. The
group is not a component: it is several `nph-rich-option` of the same control, inside an
`nph-field` that names it and carries the error message. In the list of `nph-select` and
`nph-combobox`, the same rich look is the **rich option**: it has no tag of its own, it is the
`nph-option` with `rich` and `description` (see `fichas/nph-option.md`).

**When to use:**

- When each choice of a form needs a sentence that explains the consequence, such as a plan or
  a delivery method.
- With `control="radio"`, for one choice among two to five that exclude each other.
- With `control="checkbox"`, for several independent choices, each with its explanation.
- With `control="switch"`, to turn a feature on or off with an immediate effect.
- As the rich option of a list, with `rich` on `nph-option`, when the label alone is not
  enough to choose.

**When NOT to use:**

- **For a simple list of choices with no explanation** — use `nph-radio` or `nph-checkbox`.
- **To mix controls in the same group** — use only radios, only boxes or only switches.
- **With a shortcut on a card with a switch** — the switch already acts on click.
- **For more than five exclusive choices** — use `nph-select`, or `nph-combobox` above fifteen.
- **For an action that needs a button** — the card chooses, it never runs a command.

## Variants

**By appearance:** the control (the Figma `controle`) — `checkbox`, `radio` or `switch` — the second line, the icon
and the shortcut. The second line is on by default; the icon and the shortcut are off by
default.

| Variant | Choose when |
|---|---|
| `control="radio"` | One choice among a few that need an explanation |
| `control="checkbox"` | Several independent choices, each with its explanation |
| `control="switch"` | An on and off with an immediate effect |
| With `description` | By default: the consequence of the choice in one short sentence |
| With `icon` | A symbol helps recognize the choice |
| With `shortcut` | The product binds a key to the choice and wants it visible; never with the switch |

**By size:** `not_applicable`. The card takes the width `layout/rich-option-width` and
shrinks with its container, so on a narrow screen a group stacks in one column. The height
follows the content.

**By density:** `not_applicable`.

**Do not combine with:** another control in the same group; a shortcut with the switch.

## States

The outline is decorative; the control says the choice.

| State | Token | What changes for the person |
|---|---|---|
| Default | `rich-option/background`, `rich-option/border` | The card with its resting outline, drawn inside the card |
| Checked | the control; `rich-option/border` | Only the control changes: the outline does not |
| Hover | `rich-option/background-hover` at `rich-option/background-hover-opacity` | A layer under the content; the outline does not change |
| Focus | `rich-option/focus-border`, `rich-option/focus-halo`, `rich-option/focus-ring-width`, `rich-option/focus-radius` | Keyboard only: the outline turns the focus border and a halo shows outside the card |
| Error | `rich-option/border-error`; with focus, `rich-option/focus-halo-error` | The outline turns red, checked or not; the control stays at default |
| Disabled | `rich-option/disabled-opacity` | The whole card loses opacity and stops responding |

**Feedback and focus:** the outline goes by precedence — error, then focus, then rest — and
disabled wins over all. Hover only adds the layer: error with hover keeps the error outline,
focus with hover keeps the focus outline and the halo. The hover layer takes the opacity
`rich-option/background-hover-opacity`, never the whole card. The focus shows only for the
keyboard, not on a click. The card has no motion of its own.

**The control inside:** it is a visual indicator and takes no hover from the card, so on card
hover the box, the circle and the track do not show their own hover. This is a known limit
until those pieces get an API (P134).

**Business rule the piece carries:**

- The whole card is the click area.
- The card holds the role, the state and the focus; the control inside is inert.
- Radio cards with the same `name`, in the same root and with the same form owner, are one
  group: one Tab stop, and the arrows move the focus and check, wrapping.
- Space checks a radio card and toggles a checkbox or switch card. Enter follows the control the
  card holds: nothing on a checkbox or radio card, a toggle on a switch card; it does not
  submit the form.
- Only the person fires `input` and `change`; setting `checked` from code never does.
- Only a checked checkbox or radio card enters the form; a switch card is not a form member.
- The shortcut is a hint: `keyShortcuts` is written only when the product binds the key.

**Domain error states:** `invalid`. The group failed validation: every card shows the
`rich-option/border-error` outline, and the sentence that says what to fix is the error
message of `nph-field`. `invalid` and `disabled` do not combine: `disabled` wins.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is the control: `role` checkbox, radio or switch with `aria-checked` and `aria-disabled`, through `ElementInternals`. The control drawn inside is `inert` and hidden from the screen reader, as the box of `nph-option` is |
| Accessible name | The title is the name of the control and the second line is its description, both through the internals, because an id does not cross a shadow root. The icon, the second line and the shortcut are hidden from the screen reader |
| Keyboard | Radio: Tab enters the group on the checked card or the first one that responds; the arrows move and check, wrapping; Space checks. Checkbox and switch: one Tab stop each, Space toggles, the arrows do nothing. Enter checks nothing on a checkbox or radio card and toggles a switch card. A disabled card is out of the Tab order |
| Focus | Keyboard only: the outline turns `rich-option/focus-border` and a halo of `rich-option/focus-ring-width` shows outside; the control inside takes no ring. Disabled shows none |
| Contrast | The title 19.56:1 in light and 12.45:1 in dark; the second line 6.69:1 and 8.28:1. The resting outline is decorative; the boundary that meets 3:1 is the control inside the card |
| Alternative to color | The control says the choice; the error has the sentence of `nph-field` |
| Touch target | The whole card is the click area |

**Known limits:**

- Enter does not submit the form around a checkbox or radio card: the accepted table lists a
  submit, and `nph-checkbox` and `nph-radio`, which the card follows, do not do it. It toggles
  a switch card, as `nph-switch` does (P134).
- A group of radio cards inside `nph-field` is read as a `group`, not as a `radiogroup`: the
  field reads the role of the class, and the class is `option` because the same card also
  holds a checkbox or a switch. Each card still has the `radio` role, the arrow keys and the
  one Tab stop of the group. A follow-up lets the field read the role of the instance (P134).
- `invalid` is not announced on the card: `aria-invalid` is not supported on the `radio` and
  `switch` roles, and it belongs to the group.
- In light mode of the default brand, `focus/border` measures 2.92:1 against the halo, as
  `design.md` records.
- The piece owns the `tabindex` of the host: a `tabindex` the consumer writes is replaced.
- The arrow keys are physical; there is no right-to-left mirroring, and `forced-colors` is
  not treated.
- Anything the person writes inside the card is not rendered: the title is the `text`
  property, not a slot.

## Relations

**Combines with:** `nph-field`, which names the group and carries the error message (P83:
the card is an `option`, and the field writes only `invalid` and `disabled` on it);
`nph-checkbox`, `nph-radio` and `nph-switch`, the control drawn at its start; `nph-icon`, the
icon; `nph-kbd`, the shortcut. In a list, the rich option is `nph-option` with `rich`, in
`nph-select`, `nph-combobox` and `nph-multi-combobox`.

**What is the parent:** `nph-field`, or a `form`.

**What is the child:** `nph-checkbox`, `nph-radio` or `nph-switch` as the visual indicator;
`nph-icon` and `nph-kbd`.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Card | `rich-option/padding`, `rich-option/gap`, `rich-option/radius`, `rich-option/background`, width `layout/rich-option-width` |
| Outline | `rich-option/border-width` inside the card, `rich-option/border`; error `rich-option/border-error`; focus `rich-option/focus-border` |
| Title | `text/label-md`, `rich-option/foreground` |
| Second line | `text/caption`, `rich-option/description-foreground`, `rich-option/text-gap` below the title |
| Icon | `nph-icon` `light` in a `rich-option/icon-size` box, `rich-option/foreground` |
| Control | `nph-checkbox`, `nph-radio` or `nph-switch` at the default size, inert |
| Shortcut | `nph-kbd` |
| Hover | `rich-option/background-hover` at `rich-option/background-hover-opacity`, a layer under the content |
| Focus | `rich-option/focus-border`, `rich-option/focus-halo`, `rich-option/focus-halo-error`, `rich-option/focus-ring-width`, `rich-option/focus-radius` |
| Disabled | `rich-option/disabled-opacity` |

**Usage restrictions:** only semantic tokens. `color/primary-border` is not the outline of a
checked card: the checked card keeps `rich-option/border`. The card draws no motion of its
own. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-rich-option` when each choice needs a sentence that explains it; for a simple
  list, use `nph-radio` or `nph-checkbox`.
- Use one control type per group: radio for one choice among two to five, checkbox for
  several, switch for an on and off.
- Put the cards of a group inside an `nph-field`, which names the group and carries the
  error message; give the radio cards the same `name` and each one its `value`.
- Write the title as the choice and `description` as the consequence, both already
  localized.
- Read the choice from `event.target.checked` and `event.target.value` on `change`; do not
  listen to `click`.
- Put `checked` on the default card; it is also the state the form returns to on reset.
- Set `invalid` on every card of the group together with the error message of `nph-field`;
  never leave a card red without a sentence.
- Do not put `shortcut` on a card with a switch, and set `keyShortcuts` only when the product
  binds the key.
- For the rich option of a list, write `rich` and `description` on the `nph-option`; never
  write `nph-rich-option` inside a list.

## Examples

**Recommended case:** choosing the plan, with three radio cards — monthly, annual and team —
the annual one checked, inside an `nph-field` named "Plan".

**Alternative case:** turning on notices, with switch cards and no shortcut, the first one on
and with an icon; or assigning people in the combobox, with the rich option, an avatar and a
box.

## Anti-patterns

- **Do not use the card for a simple list of choices with no explanation** — use `nph-radio`
  or `nph-checkbox`.
- **Do not mix controls in the same group.**
- **Do not put a shortcut on a card with a switch.**
- **Do not treat the shortcut as a binding** — the card binds no key.
- **Do not leave a card red without a sentence** — the error message is in `nph-field`.
- **Do not paint the outline of the checked card** — the control says the choice.
- **Do not write `nph-rich-option` inside a list** — the rich option of a list is
  `nph-option` with `rich`.
- **Invalid combinations:** a control outside the three; an icon outside the core; a
  shortcut with the switch; no text; `invalid` with `disabled`, where disabled wins.
- **Do not create without a decision:** a size, an indeterminate state, a `required`
  property, a slot, a `::part`, a color property or a checked border token.

## Sources and decisions

- **The repository `design.md`:** the `rich-option/*` tokens, `layout/rich-option-width`, the
  primitive opacity 50 and the semantics they alias.
- **The decision that originated it:** P134, the API and semantics of `nph-rich-option` and of
  the rich option of `nph-option`, with the form pattern of P80, P81, P82 and P79 and the field
  contract of P83. The frame was accepted by the design owner; the open points the code
  closed are in P134.
- **Tests:** `src/components/nph-rich-option/nph-rich-option.test.ts`,
  `nph-rich-option.lists.test.ts` and `src/components/nph-option/nph-option.rich.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-rich-option/nph-rich-option.stories.ts` (Validation) and
  `nph-rich-option.docs.stories.ts` (Docs).
- **Figma:** the `nph-rich-option` documentation frame (`6935:11785`), the card set
  (`6910:6828`) and the rich option set (`6910:7093`) in `DS-IA-NEPHOS 5.0`.
