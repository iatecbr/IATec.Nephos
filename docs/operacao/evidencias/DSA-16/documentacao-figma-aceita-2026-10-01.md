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
| End icon (optional) | Turned on by a property; the art comes from the `nph-icon` set; always clears the value, inside a 24×24 target; shows only when there is a value. |
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
| `⮑ ícone início` | Instance swap, default `magnifying-glass`, style `light`. Which icon. Only from the `nph-icon` set. |
| `⮑ ícone fim` | Instance swap, default `xmark`, style `light`. Which icon. Only from the `nph-icon` set. |
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

## Measures and tokens
Read from the variables bound in the set `622:18359`. The same in `default`
and `large`, except the height.

| Part | Token |
|---|---|
| Container | Height `control/height-default` or `control/height-large`; width `layout/input-width`; radius `radius/control`; border `border/width`; side padding `space/control-padding`; gap between the parts `space/inline`. |
| Start icon | `icon/size-sm`, color `color/muted-foreground`. |
| Value | `text/body-md`, color `color/foreground`. |
| Placeholder | `text/body-md`, color `color/muted-foreground`. |
| End target | 24×24: icon `icon/size-sm` with `space/inline-tight` around it; no radius of its own. |
| End icon | `icon/size-sm`, color `color/muted-foreground`. |

| State | Border | Halo |
|---|---|---|
| `default` | `color/input` | — |
| `hover` | `color/input-hover` | — |
| `foco` | `focus/border` | `focus/halo`, radius `focus/radius-control`, width `focus/ring-width` |
| `foco-limpar` | Container keeps `color/input`. Around the end target: `focus/border` with radius `focus/border-radius-control` | `focus/halo` around the end target, radius `focus/radius-control-with-border`, width `focus/ring-width` |
| `erro` | `status/error` | — |
| `erro-foco` | `status/error` | `focus/halo-error`, radius `focus/radius-control`, width `focus/ring-width` |
| `disabled` | `color/input`, background `color/muted`, opacity `state/disabled-opacity` | — |

## Decisions answered
Answered by Indiane on an approval page (D1, D2, D6) and on a Figma preview
(D5 combinations). D3, D4, D7, the end target measures of D2 and the error
border of D5 are what the set already binds; she confirmed the transcription.

| ID | Question | Answer |
|---|---|---|
| D1 | Which input types enter v1, and the anatomy of password, number and mask? | v1 accepts `text`, `email`, `tel`, `url` and `search`, with no extra parts. Password, number and mask are out of v1; each gets its own task later. |
| D2 | Is the end icon only the clear action, when does it show, and which tokens size its target? | It always clears the value. Swapping the icon changes only the art, never the action. It shows only when the field has a value. Target and icon tokens are in "Measures and tokens". |
| D3 | Start icon size, gap, side padding, value text role and icon color? | See "Measures and tokens": `icon/size-sm`, `space/inline`, `space/control-padding`, `text/body-md` in both sizes, `color/muted-foreground`. |
| D4 | Focus tokens, the radius around the end target, and the container border in `foco-limpar`? | `focus/border` + `focus/halo`. In `foco-limpar` the border uses `focus/border-radius-control` and the halo `focus/radius-control-with-border` around the end target; the container keeps `color/input`. |
| D5 | `erro` + `hover`, `erro` + `foco-limpar`, `disabled` + `erro`, and the error border? | The error border is `status/error`. `erro` + `hover`: the border stays `status/error`. `erro` + `foco-limpar`: the container border is `status/error` and the end target takes `focus/border` + `focus/halo`, as in `foco-limpar`. `disabled` + `erro`: disabled wins; border `color/input`, no error look. |
| D6 | Default and minimum width? | Default `layout/input-width`; the instance may stretch to its container. No minimum width. |
| D7 | Which style do the start and end icons use? | `light`, as in Figma. `regular` was a transcription error. |

## Source of the acceptance
WORK BRAIN — `2026-10-01.md`: acceptance of the documentation of checkbox, field, input and radio, among others. `2026-10-02.md`: Figma UX QA and textual audit approved. `2026-10-09.md`: the piece is ready for code, with every token on `v/5.0.0`. `2026-10-16.md`: the answers to D1 to D7.
