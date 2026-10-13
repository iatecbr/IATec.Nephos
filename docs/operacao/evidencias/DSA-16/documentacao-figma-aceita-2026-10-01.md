```json
{
  "task": "DSA-16",
  "gate": "figma-docs-accepted",
  "date": "2026-10-01",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1195-532",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input frame (1195:532), on the page `NPH — Input`, was accepted as the API and behavior specification of the nph-input. COMPONENT_SET: nph-input (622:18359), properties `size`, `state` and the properties `ícone início`, `ícone fim`, `⮑ ícone início`, `⮑ ícone fim`, `texto do valor` and `texto do placeholder`."
  }
}
```

# DSA-16 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-input` frame (`1195:532`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Input`. Indiane accepted the documentation on 01-10-2026; the Figma UX QA and the textual audit were approved on 02-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A one-line field for the person to type or edit a value.

## Description
Use `nph-input` when the person needs to type or edit a one-line value. Mask, number and password are attributes of `nph-input`, not separate components. It does not serve multi-line text; label, help and error message stay in `nph-field`.

## Anatomy

| Part | Rule |
|---|---|
| Container | Background `color/background`; when disabled, `color/muted` with `state/disabled-opacity`. |
| Start icon (optional) | Turned on by a property; the art comes from the `nph-icon` set. |
| Value or placeholder | What the person typed, or the example before typing. |
| End icon (optional) | Turned on by a property; the art comes from the `nph-icon` set; clears the value, inside a 24×24 target. |
| Border and focus | On focus, the border takes the brand color with the halo attached; the border is what guarantees the contrast. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The border uses `color/input` and it is the border that meets 3:1 against the background (WCAG 1.4.11); the halo is decoration. |
| Visible focus | On focus, the border takes the brand color with the halo attached. In `foco-limpar`, the focus border and halo stay around the end icon. |
| Color is not the only signal | On error, the written sentence stays in `nph-field`; the border color is not the only signal. |
| Touch target | The target is the field itself. `large` guarantees the 44 px and is for the screen that needs that target for the accessibility of its users. The end icon, which clears the value, has its own 24×24 target. |
| Accessible name | The name comes from the `nph-field` label. The placeholder is not a label: it disappears when the person types. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `ícone início` | Boolean, default on. Turns on an icon before the value, without creating a variant. |
| `ícone fim` | Boolean, default on. Turns on the end icon, which clears the value, inside a 24×24 target, without creating a variant. |
| `⮑ ícone início` | Instance swap, default `magnifying-glass`, style `regular`. Which icon. Only from the `nph-icon` set. |
| `⮑ ícone fim` | Instance swap, default `xmark`, style `regular`. Which icon. Only from the `nph-icon` set. |
| `texto do valor` | Boolean, default on. Shows the typed value. |
| `texto do placeholder` | Boolean, default off. Shows the placeholder. |
| `size` | Variant, default `default`. Values: `default` \| `large`. |
| `state` | Variant, default `default`. Values: `default` \| `hover` \| `foco` \| `foco-limpar` \| `erro` \| `erro-foco` \| `disabled`. `foco-limpar` is the focus on the end icon, which clears the value. `erro` shows the value needs correction; the error sentence stays in `nph-field`. |

## Relations and context
- Inside an `nph-field` when the field needs a label, help or error message.
- `nph-field` controls the error message; `nph-input` shows the `erro` state.
- The start and end icons come only from the `nph-icon` set, by instance swap.
- When disabled, the background becomes `color/muted` with `state/disabled-opacity`.

## When to use
- When the person needs to type or edit a one-line value.
- Start or end icon turned on by the property, without creating a variant.
- A form uses a single size. `default` serves general use; `large` is for the screen that needs the 44 px target for the accessibility of its users. A field and a button side by side use the same size.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Search | Start icon and end icon to clear. |
| Field with a label | The label in `nph-field`. |
| Error | The sentence in `nph-field`. |

## Do
- Use it when the person needs to type or edit a one-line value.
- Use it inside an `nph-field` when the field needs a label, help or error.
- Keep the error message in `nph-field`.
- Use the end icon to clear the value.

## Do not
- Do not paint the regular field with `color/muted`: it is the disabled background.
- Do not use the halo alone with the gray border: the border is what meets the 3:1 contrast.
- Do not put the error message inside the field: it disappears when the person types.
- Do not use the placeholder as the only label.
- Do not use it for multi-line text.

## Source of the acceptance
WORK BRAIN — `2026-10-01.md`: acceptance of the documentation of checkbox, field, input and radio, among others. `2026-10-02.md`: Figma UX QA and textual audit approved. `2026-10-09.md`: the piece is ready for code, with every token on `v/5.0.0`.
