```json
{
  "task": "DSA-28",
  "gate": "figma-docs-accepted",
  "date": "2026-10-01",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-21863",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-field frame (1194:21863), on the page `NPH — Field`, was accepted as the API and behavior specification of the nph-field. COMPONENT_SET: nph-field (657:50), properties `state`, `obrigatório`, `ícone` and the properties `mostrar apoio`, `texto de apoio`, `mensagem de erro` and `⮑ controle`."
  }
}
```

# DSA-28 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-field` frame (`1194:21863`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Field`. Indiane accepted the documentation on 01-10-2026; the Figma UX QA and the textual audit were approved on 02-10-2026. It needs no new token.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Composes label, control, help text and error message of a form field; it is the field that carries the error state.

## Description
Use `nph-field` when a control needs a name, a required mark, an explanation or an error message, or to name a group of radios or checkboxes. Filling in the error message is what makes the field invalid. It does not replace the own label of pieces such as `nph-checkbox`.

## Anatomy

| Part | Rule |
|---|---|
| Label | The name of the control, with an asterisk and an information icon when turned on. |
| Control | The piece that receives the value, swapped by instance. |
| Help text (optional) | One line of explanation, turned on by `mostrar apoio`. |
| Error message | Shows in the `erro` state, in the message line of the field. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The label uses `color/foreground`, 21:1 in light and 14.73:1 in dark; the control border is `color/input`, which meets 3:1. |
| Visible focus | The focus shows on the wrapped control: in `nph-input`, the border takes the brand color with the halo attached. |
| Color is not the only signal | The `erro` state always brings the written message; the field is never only red. |
| Touch target | Clicking the field label moves the focus to the control. |
| Accessible name | The `nph-field` label is the only name of the control; do not add a loose `nph-label` besides it. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `mostrar apoio` | Boolean, default on. Turns on the help text line. |
| `texto de apoio` | Text. Explains the expected value. |
| `mensagem de erro` | Text. The error text. Filling it in is what makes the field invalid. |
| `state` | Variant, default `default`. Values: `default` \| `erro`. `erro` when the value needs correction, always with the message filled in. |
| `obrigatório` | Variant, default `false`. Values: `false` \| `true`. Shows the asterisk on the label. |
| `ícone` | Variant, default `false`. Values: `false` \| `true`. Shows the information icon on the label. |
| `⮑ controle` | Instance swap, default `nph-input`, `size=default`, `state=default`. The control the field wraps; on error, use the control's own `erro` state. |

## Relations and context
- The control enters by the `⮑ controle` instance swap; the default is `nph-input`. On error, put the control in the `erro` state.
- In a group of radios or checkboxes, `nph-field` names the group, such as "Payment method", and carries the error message.
- `nph-checkbox` alone already brings its own name and does not need `nph-field`.
- The error message belongs to `nph-field`; the control only shows the `erro` state.

## When to use
- When the control needs a name, a required mark, an explanation or an error message.
- `obrigatório=true` when filling in is required.
- `state=erro` only with the error message filled in.
- `mostrar apoio` on when the expected value needs an explanation.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Required field filled in | The asterisk on the label. |
| Error | The sentence that says what to fix. |
| Information | The information icon and the help text. |

## Do
- Use it when a control needs a name, a required mark, an explanation or an error message.
- Use it to name a group of radios or checkboxes, such as "Payment method".
- Write the message whenever the field is in error.
- On error, put the control in the `erro` state through the `⮑ controle` swap.
- On error, also write the rule in the message: the help text leaves when the error shows.
- Use the `nph-field` label as the only name of the control.

## Do not
- Do not show an error on a disabled field: whoever cannot edit cannot fix.
- Do not leave the field red without a text explaining.
- Do not put a loose `nph-label` inside the field, besides its label.
- Do not use the control's placeholder in place of the label: it disappears when the person types.
- Do not use it when the control already has its own visible label, such as `nph-checkbox`.
- Do not use it as a box to gain space between blocks.

## Source of the acceptance
WORK BRAIN — `2026-10-01.md`: acceptance of the documentation of checkbox, field, input and radio, among others. `2026-10-02.md`: Figma UX QA and textual audit approved. `2026-10-09.md`: the piece is ready for code, with every token on `v/5.0.0`.
