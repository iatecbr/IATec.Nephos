```json
{
  "task": "DSA-23",
  "gate": "figma-docs-accepted",
  "date": "2026-10-08",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1580-61",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-toggle-group frame (1580:61), on the page `NPH — Toggle Group`, was accepted as the API and behavior specification of the nph-toggle-group. COMPONENT_SET: nph-toggle-group (1580:60), properties `texto` and the boolean property `mostrar 3º`."
  }
}
```

# DSA-23 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-toggle-group` frame (`1580:61`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Toggle Group`. Indiane accepted the visual and the documentation on 08-10-2026; the Figma UX QA and the textual audit were approved on 08-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A group of `nph-togglebutton` on the same subject, side by side and separated by space, in the toolbar.

## Description
Use it when options on the same subject turn on or off in the toolbar, such as alignment or formatting. Each button in the group is an `nph-togglebutton` and holds its own state; the group only gathers and spaces the buttons. The selection can be single (checking one unchecks the other) or multiple; that is behavior, not appearance. It does not replace `nph-button`, which fires actions. The choice depends on the place: outside a toolbar, in a setting that turns on or off with an immediate effect, use `nph-switch`; in a form, when the choice goes with the submission, use `nph-checkbox`.

## Anatomy

| Part | Rule |
|---|---|
| Container | Gathers the buttons in a row, with `space/inline` between them. It has no background, border or focus of its own. |
| Button | An `nph-togglebutton` instance, with its own state: on, focus, disabled and invalid. |
| Last button | Turned on by the `mostrar 3º` property: the group shows two or three buttons. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Comes from `nph-togglebutton`: label and icon pass 4.5:1 on their own background in both modes. The group adds no color. |
| Visible focus | Each button shows its own focus, the same as `nph-togglebutton`. The group does not receive focus. |
| Color is not the only signal | The on button changes its inner area (background, shadow and outline), not only the text color. |
| Touch target | Each button has the `control/height-default` height, and neighbors are `space/inline` apart. |
| Accessible name | The group gets a name that says the subject (`aria-label`, such as "Alignment"). Each icon-only button gets its own `aria-label`. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `texto` | `sim` \| `não`, default `sim`. `sim`: buttons with a label. `não`: icon only. Every button in the group follows the same value. |
| `mostrar 3º` | Boolean, default on. Turns the last button on or off. |
| `marcado`, `state`, `desabilitado`, `invalido` | Not properties of the group: they stay on each `nph-togglebutton`, in the instance. |
| Single or multiple selection | Not a property: it is behavior, resolved in code. |
| Position | Does not exist: the buttons stay separated, never joined. |

## Relations and context
- The group is made of `nph-togglebutton` instances, separated by `space/inline`.
- Color, state and focus come from each `nph-togglebutton`; the group does not override color.
- It sits in the toolbar, next to other buttons. Outside a toolbar, in a setting that turns on or off, use `nph-switch`; in a form, use `nph-checkbox`.
- When a button is invalid, the error message stays outside the group.

## When to use
- When two or more options on the same subject stay together in the toolbar.
- `texto=sim` when the icon alone does not say the option; `texto=não` when the icon is known and the button has an `aria-label`.
- Single selection when the options exclude each other, such as alignment; multiple when they add up, such as bold and italic.
- For a single option, use `nph-togglebutton`, without a group.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Alignment | Icon only, single selection. |
| Formatting | Icon only, multiple selection. |
| View | With text, single selection. |

## Do
- Group only options on the same subject, because the group says they are related.
- Use the same `texto` value on every button, because mixing label and icon only hurts reading.
- Name the group and give an `aria-label` to each icon-only button, because the screen reader does not read the drawing.
- Keep `space/inline` between the buttons, because the space avoids the wrong touch.

## Do not
- Do not use it to fire actions: use `nph-button`.
- Do not join the buttons without space: use `nph-toggle-group`, which already brings `space/inline`.
- Do not mix buttons with text and icon only in the same group: choose one `texto` value.

## Source of the acceptance
WORK BRAIN — `2026-10-08.md`: Figma UX QA approved, acceptance of the visual and the documentation, textual audit approved.
