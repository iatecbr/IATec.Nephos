```json
{
  "task": "DSA-17",
  "gate": "figma-docs-accepted",
  "date": "2026-10-01",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1033",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-checkbox frame (1194:1033), on the page `NPH — Checkbox`, was accepted as the API and behavior specification of the nph-checkbox. COMPONENT_SET: nph-checkbox (740:18776), properties `marcado`, `state` and the boolean property `mostrar rótulo`."
  }
}
```

# DSA-17 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-checkbox` frame (`1194:1033`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Checkbox`. Indiane accepted the documentation on 01-10-2026; the Figma UX QA and the textual audit were approved on 02-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A checkbox with its own text next to it, for the person to check independent options or turn one option on or off.

## Description
Use `nph-checkbox` when the person can check more than one option, each independent, or when there is a single option that the person turns on or off. The question that separates it from `nph-radio`: can the person check two? If the options exclude each other, the piece is `nph-radio`.

## Anatomy

| Part | Rule |
|---|---|
| Box | 16 × 16, radius `radius/inner`, border `border/width` in `color/input`. |
| Mark | The `check` icon (checked) or `minus` (indeterminate), from the `nph-icon` set, in `color/primary-foreground`. |
| Text | `text/label-md`; it is the name of the control and part of the piece, not an `nph-label`. |
| Touch area | 24 × 24 around the box. |
| Space to the text | `space/inline`. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The box border uses `color/input`, the control border color that meets 3:1 against the background (WCAG 1.4.11). |
| Visible focus | In the `foco` state, the box border turns `focus/border` and the focus halo shows on the touch area, for keyboard users; on error, the `erro-foco` state keeps the halo, in `focus/halo-error`. |
| Color is not the only signal | Checked and indeterminate show a mark, `check` or `minus`; the error has the sentence written outside the piece. |
| Touch target | The touch area is 24 × 24 around the box, which is 16 × 16. |
| Accessible name | The text is the name of the control. With `mostrar rótulo` off, the piece is only the box and the name comes from `aria-label`. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `mostrar rótulo` | Boolean, default on. Off, the piece is only the box, at 24 × 24, and needs an accessible name. There is no size: the box is always 16. |
| `marcado` | Variant, default `false`. Values: `false` \| `true` \| `indeterminado`. `true` checks the option. `indeterminado` shows a group checked only in part; it is not an answer from the person. |
| `state` | Variant, default `default`. Values: `default` \| `hover` \| `foco` \| `erro` \| `erro-foco` \| `disabled`. `erro` shows something must be fixed; the error sentence stays outside the piece. `erro-foco` is the error with the keyboard on the box. |

## Relations and context
- Options that exclude each other are `nph-radio`; do not mix checkbox and radio in the same group.
- A group of boxes is composed with `nph-checkbox` and `nph-field`: `nph-field` names the group and carries the error message.
- The box alone does not need `nph-field` to have a name: its text is already the name of the control.
- `nph-checkbox` controls its own color, state and focus by tokens; the space to the text is `space/inline`.

## When to use
- When the person can check more than one option, each independent.
- For a single option, which the person turns on or off.
- `indeterminado` only on the item that summarizes a group checked in part; it is not an answer from the person.
- `mostrar rótulo` off only when the name is already in the context, such as a table cell, always with `aria-label`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Consent | A single option, which the person turns on or off. |
| Preferences | Several independent options, stacked. |
| Group selection | The summarizing item is `indeterminado`. |

## Do
- Use it when the person can check more than one option, each independent.
- Use it for a single option, which the person turns on or off.
- Use `indeterminado` only on the item that summarizes a group checked in part.
- Keep the error message outside the piece.
- Hide the text by the `mostrar rótulo` property, instead of deleting it.

## Do not
- Do not use it when the options exclude each other: that is `nph-radio`.
- Do not put an `nph-field` around it only to give it a name: the box already brings its own text.
- Do not mix checkbox and radio in the same group.
- Do not paint the box or the mark by hand.

## Decisions answered

| ID | Question | Answer |
|---|---|---|
| D1 | Which size and variant does the mark use inside the 16 × 16 box? | The `check` or `minus` icon, light style, at `icon/size-sm` (16), the size of the box. |
| D2 | Which colors does the box take in each state? | Fill `color/background`; checked and indeterminate fill `color/primary`. Border `color/input` at rest and when disabled, `color/input-hover` on hover, `status/error` on error, checked or not. Checked or indeterminate on hover also takes `state/hover-opacity`. Disabled takes `state/disabled-opacity` on the whole piece, text included. Text `color/foreground` in every state. |
| D3 | Ring, or border plus halo? Which radii? Which tokens with error and focus? | Border plus halo. On focus, the box border turns `focus/border` and a halo in `focus/halo` covers the 24 × 24 touch area, with radius `focus/radius-inner` and stroke `focus/ring-width`. With error and focus, the border stays `status/error` and the halo is `focus/halo-error`. |
| D4 | Which tokens give the 16 × 16 box and the 24 × 24 touch area? | Box: `icon/size-sm` for width and height. Touch area: the box plus `space/inline-tight` padding on each side. |
| D5 | Where is `space/inline` measured from, and how does the box align with text that wraps? | From the edge of the 24 × 24 touch area. With text that wraps, the box sits at the top, aligned with the first line; it does not center on the block of text. |
| D6 | Is a link in the text in scope? | No. The text is a plain text property; a link, such as the terms of use, stays outside the piece, next to it or above it. |

## Source of the acceptance
WORK BRAIN — `2026-10-01.md`: acceptance of the documentation of checkbox, field, input and radio, among others. `2026-10-02.md`: Figma UX QA and textual audit approved. `2026-10-09.md`: the piece is ready for code, with every token on `v/5.0.0`. `2026-10-19.md`: D1 to D4 read from the accepted set `740:18776`; D5 and D6 answered by Indiane.
