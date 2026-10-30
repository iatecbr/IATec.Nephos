---
piece: nph-toggle-group
level: component
status: active
solves: >-
  Gathers nph-togglebutton buttons on the same subject in a row, spaced by
  space/inline, and coordinates their selection, single or multiple, in a toolbar.
use_when:
  - "When two or more options on the same subject stay together in the toolbar."
  - "With text, when the icon alone does not say the option; icon only, when the icon is known and each button has a label."
  - "Single selection when the options exclude each other, such as alignment; multiple when they add up, such as bold and italic."
do_not_use_when:
  - "To fire actions: use nph-button."
  - "For a single option: use nph-togglebutton, without a group."
  - "To join the buttons without space: nph-toggle-group already brings space/inline."
  - "To mix buttons with text and icon-only buttons in the same group: choose one."
  - "Outside a toolbar, in a setting that turns on or off with an immediate effect: use nph-switch."
  - "In a form, when the choice goes with the submission: use nph-checkbox."
api:
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The name of the group, the subject, such as Alignment. It becomes the
      aria-label of the host, which is the role group. A name the consumer puts on
      the host with aria-label or aria-labelledby also counts. Without any name,
      the group draws nothing and emits console.error in development.
  selection:
    type: string
    required: false
    default: single
    reflects: false
    constraint: >-
      single or multiple. It is behavior, not appearance, and the Figma frame leaves
      it to code; the name and the default are a technical proposal of P76. In
      single, checking a button unchecks the others and one stays checked once a
      choice is made; a click on the checked button does nothing. In multiple, each
      button is free. Any other value draws nothing and emits console.error in
      development.
  size:
    type: string
    required: false
    default: default
    reflects: true
    constraint: >-
      The Figma property tamanho: compact, default or large. Every button of the
      group takes it, 28, 36 or 44 px high and, icon only, the icon of that size:
      the group writes size on every button, as it writes pressed, so a size set on
      a button inside the group is overwritten. Compared as written, as on the
      button. Any other value draws nothing and emits console.error in development.
  value:
    type: "list of strings (attribute: words separated by spaces)"
    required: false
    default: "empty list"
    reflects: false
    constraint: >-
      The checked buttons, by the value attribute of each. The attribute reads
      value="bold italic"; the property is a list of strings. Single holds zero or
      one item; a second one is dropped with a warning in development. With no
      value, none is checked, even if a button carries pressed in the markup: the
      group writes pressed on every button from it. Setting it from code never fires
      the event.
  slot:
    type: "default slot"
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The nph-togglebutton buttons, at least two and with no maximum. Each one names
      itself with a value attribute, which the group reads and the button ignores:
      a non-empty word with no whitespace, unique in the group. A button whose value
      is empty, repeated or has more than one word never joins the selection. A
      change of the value attribute of a button is picked up by the group. Text,
      label, icons, disabled and invalid stay on each button.
  nph-value-change:
    type: event
    required: false
    default: "none"
    reflects: false
    constraint: >-
      Fired when the person changes the selection. It bubbles, crosses the shadow
      root and is not cancelable. detail.value is the list of checked values, in the
      order of the buttons. The nph-change of each button is not stopped.
variants:
  selection:
    axis: behavior
    choose_when: "single when the options exclude each other, such as alignment. multiple when they add up, such as bold and italic."
    do_not_combine_with: []
  content:
    axis: appearance
    choose_when: "With text when the icon alone does not say the option. Icon only when the icon is known and each button has a label. The same for every button of the group."
    do_not_combine_with:
      - "buttons with text and icon-only buttons in the same group: choose one."
  size:
    axis: size
    choose_when: "compact (28 px), default (36 px, the default) or large (44 px), the same for every button of the group. On touch screens, use large."
    do_not_combine_with:
      - "compact: do not use as the main target on a touch screen."
states:
  group:
    token: space/inline
    changes_for_user: "The group has no state of its own: it spaces the buttons. Pressed, focus, disabled and invalid belong to each nph-togglebutton."
business_rules:
  - "The group is the source of truth of the selection and of the size: it writes pressed on every button from value and size on every button from its own size, and the buttons never decide them alone."
  - "In single selection, a click, Enter or Space on the checked button does nothing: it stays checked, no event fires and the click does not reach the page. With no value, none is checked until the first click."
  - "Only a click, Enter or Space by the person fires nph-value-change; setting value from code never fires it."
  - "Changing only the value attribute of a button is enough: the group observes it, writes pressed again and checks the composition, without firing nph-value-change."
  - "There is no maximum number of buttons. With fewer than two buttons the group still renders and warns in development; for a single option use nph-togglebutton."
  - "disabled and invalid stay on each button; the error message of an invalid button stays outside the group."
domain_errors:
  - "invalid: a button whose value the screen does not accept shows its own error border; the message is written outside the group."
tokens:
  gap: space/inline
  button_height: "control/height-compact, control/height-default or control/height-large, by size, from each nph-togglebutton"
  color_state_focus: "from each nph-togglebutton; the group adds none"
ai_hints:
  - "Use nph-toggle-group for two or more options on the same subject in a toolbar; for a single option, use nph-togglebutton."
  - "Name the group with label, and every button with a value attribute; an icon-only button also needs its own label."
  - "Choose selection single when the options exclude each other and multiple when they add up."
  - "Read the new value from detail.value of nph-value-change; do not read it from the buttons after a click."
  - "Do not put pressed on a button inside the group: set value on the group."
  - "Set size on the group, not on its buttons: compact, default or large; on touch screens, use large."
  - "Use the same content for every button: text on all, or icon only on all."
  - "To fire an action, use nph-button; outside a toolbar use nph-switch; in a form use nph-checkbox."
accessibility:
  semantics: "The host is role group, named by label. Each button is the native button of nph-togglebutton, with aria-pressed. In single selection it is not a radio group: P73 fixes aria-pressed and never aria-checked, so the screen reader reads the state of each button and does not announce that the choice is exclusive. Known limit."
  accessible_name: "The group is named with the subject. Each icon-only button gets its own label, an aria-label on its native button."
  keyboard:
    - "Tab moves through the buttons, one stop each, in order; a disabled button is skipped."
    - "Enter toggles the focused button."
    - "Space toggles the focused button."
    - "There are no arrow keys: a roving tabindex across several groups belongs to a toolbar."
  focus: "Each button shows its own focus, as nph-togglebutton does; the group does not receive focus. space/inline is wider than the border and the halo of one button, so the focus of a button is not covered by its neighbor."
  contrast: "Comes from nph-togglebutton: the label and the icon on their own background in both schemes. The group adds no color. The known limit of the focus border of nph-togglebutton, color/primary, holds here unchanged."
  color_alternative: "The pressed button changes its background, its label color and its icon, not only the text color."
invalid_combinations:
  - "No name — no label, no aria-label and no aria-labelledby: the group draws nothing."
  - "A selection that is not single or multiple — the group draws nothing."
  - "A size that is not compact, default or large — the group draws nothing."
  - "A button without value, with a value of more than one word, or two buttons with the same value — the button never joins the selection; the group warns in development."
  - "A value that matches no button — nothing is checked for it; the group warns in development."
  - "More than one value in single — only the first is kept; the group warns in development."
  - "Buttons with text mixed with icon-only buttons — the group renders and warns in development."
  - "A child that is not an nph-togglebutton — it is not part of the selection; the group warns in development."
relations:
  combines_with: [nph-togglebutton, nph-icon]
  parents: ["toolbar"]
  children: [nph-togglebutton]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the group to fire actions."
  - "Joining the buttons without space."
  - "Mixing buttons with text and icon-only buttons in the same group."
  - "Grouping options that are not on the same subject."
  - "Using the group for a single option."
  - "Using the group outside a toolbar for a setting that turns on or off, where nph-switch is the choice."
  - "Using the group in a form, where nph-checkbox is the choice."
  - "Putting an error message inside the group."
sources:
  design_md: "design.md, space/inline, control/height-compact, control/height-default, control/height-large and the core icons align-left, align-center, align-right, bold, italic and underline"
  decision: "P76 — API and semantics of nph-toggle-group, and its amendment of 29-10-2026 (DSA-61): size"
  tests: "src/components/nph-toggle-group/nph-toggle-group.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-toggle-group/nph-toggle-group.stories.ts and nph-toggle-group.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-toggle-group frame 1580:61 and set 1580:60"
---

# nph-toggle-group

## Function

**The problem it solves:** gathers `nph-togglebutton` buttons on the same subject in a row,
spaced by `space/inline`, and coordinates their selection, single or multiple, in a toolbar.
Each button holds its own look and its focus; the group spaces the buttons and decides which
ones are checked. It does not replace `nph-button`, which fires an action.

**When to use:**

- When two or more options on the same subject stay together in the toolbar.
- With text, when the icon alone does not say the option; icon only, when the icon is known
  and each button has a label.
- Single selection when the options exclude each other, such as alignment; multiple when
  they add up, such as bold and italic.

**When NOT to use:**

- **To fire actions** — use `nph-button`.
- **For a single option** — use `nph-togglebutton`, without a group.
- **To join the buttons without space** — `nph-toggle-group` already brings `space/inline`.
- **To mix buttons with text and icon-only buttons in the same group** — choose one.
- **Outside a toolbar, in a setting that turns on or off with an immediate effect** — use
  `nph-switch`.
- **In a form, when the choice goes with the submission** — use `nph-checkbox`.

## Variants

**By behavior:** the selection, `single` or `multiple`. It is not a Figma property: the
frame leaves it to code, and the group takes it from `selection`.

**By appearance:** with text or icon only, the same for every button. The Figma frame draws
two or three buttons; in code there is no maximum.

| Variant | Choose when |
|---|---|
| `selection` single | The options exclude each other, such as alignment |
| `selection` multiple | The options add up, such as bold and italic |
| With text | The icon alone does not say the option |
| Icon only | The icon is known and each button has a `label` |

**By size:** `size`, the Figma property `tamanho`: `compact` (28 px), `default` (36 px, the
default) or `large` (44 px). Every button of the group takes it: the group writes `size` on
each one, so the buttons always have the same height. On touch screens, use `large`;
`compact` is never the main target on a touch screen.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** buttons with text and icon-only buttons in the same group.

## States

The group has no state of its own. Pressed, focus, disabled and invalid belong to each
`nph-togglebutton`, which draws them; the group adds no color, border or outline.

| State | Token | What changes for the person |
|---|---|---|
| Group | `space/inline` | The buttons are side by side, 8 px apart, never joined |

**Feedback and focus:** each button shows its own focus, for keyboard users, and the group
does not receive focus. `space/inline` is wider than the border and the halo of one button,
so a focused button is not covered by its neighbor.

**Business rule the group carries:**

- The group is the source of truth of the selection and of the size: it writes `pressed` on
  every button from `value`, and `size` on every button from its own `size`.
- In single selection, a click, Enter or Space on the checked button does nothing: it
  stays checked, no event fires and the click does not reach the page. With no value, none
  is checked until the first click.
- Only a click, Enter or Space by the person fires `nph-value-change`; setting `value` from
  code never fires it.
- Changing only the `value` attribute of a button is enough: the group observes it, writes
  `pressed` again and checks the composition, without firing `nph-value-change`.
- There is no maximum number of buttons. With fewer than two the group still renders and
  warns in development.

**Domain error states:** `invalid`, on a button. The button shows its own error border; the
message is written outside the group, by whoever uses it.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is `role` group, named by `label`. Each button is the native button of `nph-togglebutton`, with `aria-pressed`. In single selection it is not a radio group: `P73` fixes `aria-pressed` and never `aria-checked`, so the screen reader reads the state of each button and does not announce that the choice is exclusive. Known limit |
| Accessible name | The group is named with the subject (`label`, or `aria-label` or `aria-labelledby` on the host). Each icon-only button gets its own `label` |
| Keyboard | Tab moves through the buttons, one stop each, in order; a disabled button is skipped. Enter and Space toggle the focused button. There are no arrow keys: a roving tabindex across several groups belongs to a toolbar |
| Focus | Each button shows its own focus, as `nph-togglebutton` does. The group does not receive focus |
| Contrast | Comes from `nph-togglebutton`. The group adds no color. The known limit of the focus border of `nph-togglebutton`, `color/primary`, holds here unchanged |
| Alternative to color | The pressed button changes its background, its label color and its icon, not only the text color |
| Touch target | Each button is 28, 36 or 44 px high, by the `size` of the group, and neighbors are `space/inline` apart. On touch screens, use `large` |

## Relations

**Combines with:** `nph-togglebutton`, the buttons it is made of, and `nph-icon`, through
the icons of each button. `nph-switch` (a setting outside a toolbar) and `nph-checkbox` (a
choice in a form) are **planned** and do not exist yet.

**What is the parent:** a toolbar, next to other buttons.

**What is the child:** `nph-togglebutton`, in the default slot, with its `value` attribute.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Container | No background, border, outline or focus of its own |
| Space between buttons | `space/inline` |
| Button | `control/height-compact`, `control/height-default` or `control/height-large` by `size`, and every other token, from `nph-togglebutton` |

**Usage restrictions:** the group consumes one token, `space/inline`, and chooses no
color, radius or typography; the height is the one of the `size` it writes on its buttons. The `use` of `space/inline` in `design.md` already names the
buttons of a group. In a part of the screen with another brand, `data-nph-brand` and
`data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-toggle-group` for two or more options on the same subject in a toolbar; for a
  single option, use `nph-togglebutton`.
- Name the group with `label`, and every button with a `value` attribute; an icon-only
  button also needs its own `label`.
- Choose `selection` `single` when the options exclude each other and `multiple` when they
  add up.
- Read the new value from `detail.value` of `nph-value-change`; do not read it from the
  buttons after a click.
- Do not put `pressed` on a button inside the group: set `value` on the group.
- Set `size` on the group, not on its buttons: `compact`, `default` or `large`; on touch
  screens, use `large`.
- Use the same content for every button: text on all, or icon only on all.
- To fire an action, use `nph-button`; outside a toolbar use `nph-switch`; in a form use
  `nph-checkbox`.

## Examples

**Recommended case:** alignment, with three icon-only buttons (`align-left`, `align-center`
and `align-right`), single selection, the group named "Alignment" and each button with its
`label`.

**Alternative case:** formatting, with bold, italic and underline icon-only buttons and
multiple selection; or a view switch, with the text buttons "List", "Grid" and "Table" and
single selection.

## Anti-patterns

- **Do not use the group to fire actions** — use `nph-button`.
- **Do not join the buttons without space** — `nph-toggle-group` brings `space/inline`.
- **Do not mix buttons with text and icon-only buttons** — choose one for the whole group.
- **Do not group options that are not on the same subject** — the group says they are
  related.
- **Do not use the group for a single option** — use `nph-togglebutton`.
- **Do not use it outside a toolbar for a setting that turns on or off** — use
  `nph-switch`.
- **Do not use it in a form** — use `nph-checkbox`.
- **Do not put the error message inside the group** — it stays outside.
- **Invalid combinations:** no name; a `selection` that is not `single` or `multiple`; a
  button without `value`, with a `value` of more than one word or with a repeated one; a `value` that matches no button; more
  than one value in `single`; text mixed with icon only; a child that is not an
  `nph-togglebutton`; a `size` that is not `compact`, `default` or `large`.
- **Do not create without a decision:** a size beyond the three, a `disabled` or `invalid`
  property on the group, a maximum, an orientation, a color property or a form association.

## Sources and decisions

- **The repository `design.md`:** `space/inline`, `control/height-compact`,
  `control/height-default`, `control/height-large` and the core icons `align-left`,
  `align-center`, `align-right`, `bold`, `italic` and `underline`.
- **The decision that originated it:** P76, of 20-10-2026, amended on 29-10-2026 (DSA-61):
  `size`. The frame was accepted by Indiane on 08-10-2026; the answers on icons, the number
  of buttons and single selection, on 19-10-2026; the frame with the size, on 29-10-2026.
- **Tests:** `src/components/nph-toggle-group/nph-toggle-group.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-toggle-group/nph-toggle-group.stories.ts` (Validation)
  and `nph-toggle-group.docs.stories.ts` (Docs).
- **Figma:** `nph-toggle-group` frame (`1580:61`) and set `1580:60` in `DS-IA-NEPHOS 5.0`.
