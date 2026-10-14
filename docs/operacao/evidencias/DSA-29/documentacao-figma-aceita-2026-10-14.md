```json
{
  "task": "DSA-29",
  "gate": "figma-docs-accepted",
  "date": "2026-10-14",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1357-160",
    "date": "2026-10-14",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-select frame (1357:160), documentation 1452:448, on the page `NPH — Select`, was accepted as the API and behavior specification of the nph-select. COMPONENT_SET: nph-select (1357:115), variants `size`, `state`, `início`, `conteúdo` and the swap property `ícone início`. Internal pieces: `nph-select / opção` (1357:136) and `nph-select / lista` (1357:137)."
  }
}
```

# DSA-29 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-select` board (`1357:160`,
documentation `1452:448`) on 14-10-2026, in the file `DS-IA-NEPHOS 5.0`. The
Figma UX QA and the textual audit were approved on 14-10-2026. The component
needed two new tokens, taken to `v/5.0.0` with this task: `radius/control-inner`
and `layout/max-list-height`. Every other token it uses was already there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A field that opens a closed list of options for the person to pick one.

Selection: `nph-select` — properties `size`, `state`, `início`, `conteúdo` and
`ícone início`. The list is `nph-select / lista` and each option is
`nph-select / opção`, with `state`, `início`, `marcador`, `ícone`, `rótulo`,
`texto secundário` and `secundário`.

## Description
Use it when the person picks a single option from a closed list of 6 to 15
items. It does not replace `nph-radio`, for 2 to 5 options visible at once, nor
`nph-combobox`, for more than 15 options or when the person needs to search. To
pick several options, use `nph-multi-combobox`.

## Anatomy

| Part | Rule |
|---|---|
| 1. Trigger | The field box that opens the list. Background `color/background`, border `border/width` in `color/input`, radius `radius/control`, width `layout/input-width`, height `control/height-default` (or `control/height-large`), left padding `space/control-padding`, gap `space/inline`, right padding 0 (the arrow area closes the field). On focus and with the list open, the border becomes `focus/border` and gains the halo. |
| 2. Start | Icon or avatar of the chosen option, optional, before the text. Icon: `nph-icon` in `icon/size-sm`, color `color/muted-foreground`, default `globe`. Avatar: `nph-avatar` size `sm` (`avatar/size-sm`, `avatar/radius-sm`). |
| 3. Text | The chosen value in `text/body-md`, `color/foreground`; with no value, the placeholder in `text/body-md`, `color/muted-foreground`. |
| 4. Divider | Vertical line `border/width` wide in `color/border`, separating the text from the arrow area. |
| 5. Arrow area | Background `color/accent`, fitted into the border: width `control/height-default` (or `control/height-large`), radius `radius/none` on the left corners and `radius/control-inner` on the right corners. The arrow is `nph-icon` `chevron-down` in `icon/size-sm`, `color/muted-foreground`; with the list open, `chevron-up`. |
| 6. List | `nph-select / lista`. Floating layer attached to the trigger, same width (`layout/input-width`): background `color/popover`, border `border/width` in `color/input`, radius `radius/container`, padding `space/inline-tight`, maximum height `layout/max-list-height`, elevation `elevation/dropdown`. |
| 7. Option | `nph-select / opção`. List item with optional start, label and optional secondary text: padding and gap `space/inline`, radius `radius/inner`, width of the list. The start can be icon, avatar or dot. |
| 8. Check | The `check` (`nph-icon`, `icon/size-sm`) at the end of the selected option, in `color/primary`. |

Focus halo of the trigger: `focus/ring-width` in `focus/halo`, radius
`focus/radius-control`, outside the piece.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The text of the trigger and of the option passes 4.5:1 and the border of the trigger passes 3:1, in light and dark. The disabled state is exempt. The arrow keeps 3:1 on the `color/accent` background. |
| Visible focus | Focus changes the border to `focus/border` and adds the `focus/halo` halo; it stays so with the list open. In `erro-foco`, the border is `status/error` and the halo is `focus/halo-error`. |
| Color is not the only signal | The error paints the border, and the error message comes as text, in `nph-field`. The selected option has a background and the check. The status dot goes with the written label. When the list opens, the arrow also turns up. |
| Touch target | The whole trigger is the target that opens the list, with width `layout/input-width` and height `control/height-default` or `control/height-large`; the arrow area is part of it. The option takes the width of the list. |
| Accessible name | The field name comes from the `nph-field` label. The start icon and avatar are hidden from the screen reader (`aria-hidden`), because the text next to them already says the option. The arrow, the divider and the status dot are also hidden (`aria-hidden`). |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `default` \| `large`, default `default`. `large` only on a screen that needs a larger target for accessibility. It changes the trigger height (`control/height-default` → `control/height-large`) and the arrow area width (same tokens). |
| `state` | `default` \| `hover` \| `foco` \| `aberto` \| `erro` \| `erro-foco` \| `disabled`, default `default`. `hover`: border `color/input-hover`. `foco`: border `focus/border` and halo `focus/halo`. `aberto` is `foco` with the list open and the arrow up (`chevron-up`). `erro`: border `status/error`; the error comes from the field. `erro-foco`: border `status/error` and halo `focus/halo-error`. `disabled`: background `color/muted`, border `color/input`, opacity `state/disabled-opacity`. |
| `início` | `nenhum` \| `ícone` \| `avatar`, default `nenhum`. `ícone` when the options have a symbol of their own; `avatar` when the options are people. The trigger repeats the start of the chosen option. |
| `conteúdo` | `valor` \| `placeholder`, default `valor`. `valor` shows the chosen option; `placeholder` shows the invitation before the choice. Never both. |
| `ícone início` | Swappable instance. Default `globe`. Do not use the magnifying glass: search belongs to `nph-combobox`. |
| Option (not a property of the field) | `nph-select / opção`: `state` `default` \| `hover` \| `selecionada` \| `disabled`; `início` `nenhum` \| `ícone` \| `avatar` \| `ponto`; `ícone` swaps the symbol when `início=ícone`. In `nph-select`, `marcador` is always `marca`; `checkbox` belongs to `nph-multi-combobox`. `rótulo` is the option text; `texto secundário` turns on `secundário`, a helper text after the label, and is off by default. The dot exists only in the option; its color comes from the state, in `status/*` or, for the neutral state, in `color/muted-foreground`; with no state, it follows the text color. |
| List (not a property of the field) | `nph-select / lista`: shows up to 8 options and scrolls above that, by the height `layout/max-list-height`. It has no groups. |
| Width | Not a property. It follows `layout/input-width`. |

### Option, token by state

| Part | Token |
|---|---|
| Label | `text/label-md`, `color/popover-foreground`; on `hover`, `color/accent-foreground`. |
| Secondary text | `text/label-md`, `color/muted-foreground`, after the label with gap `space/inline-tight`. |
| Start icon | `nph-icon` in `icon/size-md`, `color/popover-foreground`; on `hover`, `color/accent-foreground`. |
| Start avatar | `nph-avatar` size `sm`. |
| Start dot | Indicator `space/inline` × `space/inline` inside an `icon/size-md` box. Color: `status/warning`, `status/info`, `status/success` (and the other `status/*`) by state, `color/muted-foreground` for the neutral state; with no state, the text color (`color/popover-foreground`, `color/accent-foreground` on `hover`). |
| Background | `default`: none. `hover`: `color/accent`. `selecionada`: `color/primary-surface`, with the check in `color/primary`. `disabled`: opacity `state/disabled-opacity`. |

## Relations and context
- `nph-select` sits inside `nph-field`, which gives the label, the help text
  and the error message.
- The start avatar is an `nph-avatar` instance in size `sm`; the icon is an
  `nph-icon` instance.
- The list opens attached to the trigger, with the same width, and uses
  `elevation/dropdown`.
- Between the start, the text and the arrow, the space is `space/inline`.
- The arrow area uses `color/accent` and fits into the border with
  `radius/control-inner`; the divider uses `color/border`.
- The option is shared with the `nph-combobox` list.

## When to use
- From 6 to 15 options, single choice: `nph-select`.
- From 2 to 5 options: `nph-radio`, because the person sees all of them without
  opening anything.
- More than 15 options, or when the person knows what they are looking for:
  `nph-combobox`.
- To pick several: `nph-multi-combobox`.
- `início=avatar` when the choice is a person; `início=ícone` when the symbol
  helps recognize the option.
- `início=ponto` on the option when each option has a state; the label writes
  the state.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Department | Short list, no start. |
| Owner | People with avatar, open. |
| Required with no choice | Error. |

## Do
- Order the options in a way the person recognizes, because the list has no
  search.
- Use the placeholder as a short invitation, such as “Select an option”.
- Repeat in the trigger the start of the chosen option, so the person checks
  it without opening the list.
- Keep the same start on every option of the list, so the eye finds the pattern.
- Write the state in the label when using the status dot, because the color only
  reinforces it.

## Do not
- Do not use it with 2 to 5 options: use `nph-radio`.
- Do not use it with more than 15 options: use `nph-combobox`.
- Do not put a checkbox on the option: multiple choice belongs to
  `nph-multi-combobox`.
- Do not use the magnifying glass at the start: it suggests search, which
  belongs to `nph-combobox`.
- Do not mix options with and without a start in the same list: use one start.
- Do not change the color of the arrow area: it uses `color/accent`; for an
  error, use `state=erro`.
- Do not use the status dot without a label: write the state in the option text.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-14.md`: visual acceptance of the
reopening and of `state=aberto`, Figma UX QA approved, acceptance of the
documentation board and textual audit approved (round 3).
