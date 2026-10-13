```json
{
  "task": "DSA-18",
  "gate": "figma-docs-accepted",
  "date": "2026-10-01",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1196-311",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-radio frame (1196:311), on the page `NPH — Radio`, was accepted as the API and behavior specification of the nph-radio. COMPONENT_SET: nph-radio (848:66), properties `marcado`, `state` and the boolean property `mostrar rótulo`."
  }
}
```

# DSA-18 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-radio` frame (`1196:311`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Radio`. Indiane accepted the documentation on 01-10-2026; the Figma UX QA and the textual audit were approved on 02-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A circle the person checks to choose one option in a group; checking one unchecks the other.

## Description
Use `nph-radio` when the options exclude each other, such as payment method, employment type or shift, in a group of two to five options. The group is not a component: it is several `nph-radio` inside an `nph-field`. If the person can check more than one, the piece is `nph-checkbox`; with more than five options, `nph-select`.

## Anatomy

| Part | Rule |
|---|---|
| Circle | 16 × 16, radius `radius/full`, border `color/input`. |
| Dot | Fills the inner space after the `space/inline-tight` padding, in `color/primary-foreground`. |
| Text | `text/label-md` in `color/foreground`; it is the name of the control. |
| Touch area | 24 × 24 around the circle. |
| Space to the text | `space/inline`. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Circle outline in `color/input`: 3.23:1 in light and 6.58:1 in dark; the text, 21:1 and 14.73:1. |
| Visible focus | In the `foco` state, the ring shows around the circle; in `erro-foco`, the error ring goes outside. |
| Color is not the only signal | The border says the state and the fill says the choice; the error has the sentence in `nph-field`. |
| Touch target | A 24 × 24 click area around the 16 circle; the text next to it also triggers the option. |
| Accessible name | The text is the name of the control, and the group gets the `nph-field` name. Without visible text, the accessible name is required. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `mostrar rótulo` | Boolean, default on. Off, the piece is 24 × 24 and needs an accessible name. There is no size: the circle is always 16. |
| `marcado` | Variant, default `false`. Values: `false` \| `true`. There is no indeterminate. |
| `state` | Variant, default `default`. Values: `default` \| `hover` \| `foco` \| `erro` \| `erro-foco` \| `disabled`. The border says the state; the fill says the choice. Error and disabled do not combine. |

## Relations and context
- Above: `nph-field` names the group, such as "Payment method", and carries the error message.
- Beside: the other radios of the same group; a radio never shows alone.
- Inside: nothing; the dot is a shape, not a piece from another set.
- `nph-rich-option` may use the radio with the text off, when the card is an exclusive choice.

## When to use
- The options exclude each other: payment method, employment type, work shift.
- The group is small and fits the screen, with up to five options.
- Every option must stay visible at the same time, for the person to compare before choosing.
- Always in a group of two or more, with one option checked when there is a reasonable default.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Payment method | Three options, one checked. |
| Employment type | Exclusive choice. |
| Work shift | A small group, all visible. |

## Do
- Use it when the options exclude each other: payment method, employment type, shift.
- Use it always in a group of two to five options.
- Name the group in the `nph-field` around it.
- Check one option by default when there is a reasonable choice.
- Write the options in the same form and order them by a visible logic.

## Do not
- Do not use it when the person can check more than one: that is `nph-checkbox`.
- Do not use a radio alone: either options are missing, or the piece is `nph-checkbox`.
- Do not leave the radio red without a sentence explaining.
- Do not expect the person to uncheck by clicking again: offer "None" or use a checkbox.
- Do not mix radio and checkbox in the same group.

## Source of the acceptance
WORK BRAIN — `2026-10-01.md`: acceptance of the documentation of checkbox, field, input and radio, among others. `2026-10-02.md`: Figma UX QA and textual audit approved. `2026-10-09.md`: the piece is ready for code, with every token on `v/5.0.0`.
