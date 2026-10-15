```json
{
  "task": "DSA-31",
  "gate": "figma-docs-accepted",
  "date": "2026-10-15",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1467-25660",
    "date": "2026-10-15",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-multi-combobox frame (1467:25660), on the page `NPH — Multi Combobox` (1467:24860), was accepted as the API and behavior specification of the nph-multi-combobox. COMPONENT_SET: nph-multi-combobox (1467:25652), variants `size`, `state` and `conteúdo`. Internal piece: `nph-multi-combobox / chip` (1467:24879), with `state`, `rótulo`, `ícone início` and `⮑ ícone`. The list is `nph-combobox / lista` (1359:141) with the option `nph-select / opção` (1357:136) in `marcador=checkbox`."
  }
}
```

# DSA-31 — `figma-docs-accepted`

The documentation of the `nph-multi-combobox` board (`1467:25660`) was accepted
in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual
audit approved. The component needed one new token, taken to `v/5.0.0` with
this task: `layout/multi-combobox-width` (with its primitive
`core/layout-width/multi-combobox`). Every other token it uses was already
there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A field where the person searches a closed list and picks several options, shown
as chips inside the field itself.

Selection: `nph-multi-combobox` — properties `size`, `state` and `conteúdo`.
Each chosen option is a `nph-multi-combobox / chip`, with `state`, `rótulo`,
`ícone início` and `⮑ ícone`.

## Description
Use it when the person needs to pick more than one option from a known list and
see what is already chosen without opening the list. Each choice becomes a chip
with a button to remove it. It does not replace `nph-select` or `nph-combobox`,
which keep a single option, and it does not accept text outside the list.

## Anatomy

| Part | Rule |
|---|---|
| Field | The box that holds everything. Background `color/background`, border `border/width` in `color/input`, radius `radius/control`, default width `layout/multi-combobox-width`, minimum height `control/height-default` (or `control/height-large`), horizontal padding `space/control-padding`, vertical padding `space/inline-tight`, gap between its parts `space/inline`. The height is a minimum: the field grows when the chips go to another line. |
| 1. Magnifying glass | `nph-icon` `magnifying-glass` at the start of the field, `icon/size-sm`, `color/muted-foreground`. It says the field searches the list. Decorative. |
| 2. Chips | One chosen option per chip (`nph-multi-combobox / chip`), a pill in the soft brand tone. They stay on the same line while they fit and go down to the next line when space runs out. Between chips, and between the chips and the typed text, the space is `space/inline-tight`, in both directions. |
| 3. Remove | Button at the end of each chip; it removes only that option. Its own target of 24 × 24 inside the chip (padding `space/inline-tight` around the icon), larger than the icon: `nph-icon` `xmark`, `icon/size-sm`, in the chip text color. |
| 4. Typed text or placeholder | The placeholder shows only when nothing is chosen: `text/body-md`, `color/muted-foreground`. The typed text comes after the chips and filters the list: `text/body-md`, `color/foreground`, with the text cursor `border/width` wide, `icon/size-sm` high, in `color/foreground`. |
| 5. Arrow | `nph-icon` `chevron-down` at the end of the field, `icon/size-sm`, `color/muted-foreground`. It says there is a list to open. |
| 6. List | `nph-combobox / lista`, with the options in `marcador=checkbox`. It opens below the field and can have groups and an empty state (`state` `resultados` \| `grupos` \| `vazio`). |
| 7. Focus ring | Shows only when the field or a remove button gets focus. |

### Chip, token by state

| Part | `default` | `foco-remover` | `disabled` |
|---|---|---|---|
| Background | `color/primary-surface` | `color/primary-surface` | `color/muted` |
| Radius | `radius/full` | `radius/full` | `radius/full` |
| Label (`rótulo`) | `text/label-sm`, `color/primary-on-surface` | `text/label-sm`, `color/primary-on-surface` | `text/label-sm`, `color/muted-foreground` |
| Start icon (`ícone início`) | `nph-icon` `icon/size-sm`, `color/primary-on-surface` | same | same size, `color/muted-foreground` |
| Remove button | `xmark`, `color/primary-on-surface` | `xmark`, `color/primary-on-surface`, with the focus ring around the button only | none: the disabled chip has no remove button |
| Padding and gap | horizontal `space/inline`, gap `space/inline-tight` | same | horizontal `space/inline`, vertical `space/inline-tight`, gap `space/inline-tight` |

Focus ring of the remove button (`foco-remover`): an inner border
`border/width` in `focus/border` with radius `focus/border-radius-control`, and
the halo `focus/ring-width` in `focus/halo` with radius
`focus/radius-control-with-border`, around the 24 × 24 target only.

Focus halo of the field: `focus/ring-width` in `focus/halo` (or
`focus/halo-error`), radius `focus/radius-control`, outside the piece.

### Counter (`conteúdo=contador`)
The field stays on one line. After the magnifying glass, one line of text in
`text/body-md`, `color/foreground`, and then the counter: an `nph-badge` with
`tipo=primary` and `enfase=solid` (background `color/primary`, number in
`text/label-sm`, `color/primary-foreground`, radius `radius/full`), showing how
many options are chosen. The open list shows every choice. What the line of
text says is pending decision D1.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Border, text, placeholder and remove button pass the minimum contrast required, in light and dark. The field border keeps 3:1 against the background. |
| Visible focus | The field in focus changes its border to `focus/border` and gains the focus ring. On the remove button, the ring follows only the button. |
| Color is not the only signal | The error changes the border color and comes with the `nph-field` message, below the field. The disabled state has the `color/muted` background, reduced opacity and loses the remove button. |
| Touch target | The whole field is the target, with the minimum height of the chosen size. The remove button has its own 24 × 24 area inside the chip, larger than the icon. |
| Accessible name | The label comes from `nph-field`. The magnifying glass and the arrow are `aria-hidden`. The remove button has only an icon and carries an `aria-label` with the option it removes; the text read is defined in the repository, with the behavior. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `default` \| `large`, default `default`. It changes the minimum height of the field (`control/height-default` → `control/height-large`). |
| `state` | `default` \| `hover` \| `foco` \| `erro` \| `erro-foco` \| `disabled`, default `default`. The state belongs to the field. `hover`: border `color/input-hover`. `foco`: border `focus/border` and halo `focus/halo`. `erro`: border `status/error`; the error message comes from `nph-field`. `erro-foco`: border `status/error` and halo `focus/halo-error`. `disabled`: background `color/muted`, border `color/input`, opacity `state/disabled-opacity`, chips in `disabled`. |
| `conteúdo` | `placeholder` \| `itens` \| `digitando` \| `várias linhas` \| `contador`, default `placeholder`. `placeholder`: nothing chosen. `itens`: chips on one line. `digitando`: chips and the typed text; it exists only with `foco` and `erro-foco`. `várias linhas`: the chips go down to more lines and the field grows; it exists only with `default`. `contador`: the line of text and the counter, on one line. |
| Width (not a variant) | The default is `layout/multi-combobox-width`; on the screen, the instance stretches to the width of the form. |
| Height (not a variant) | It is a minimum: it grows when the chips go to another line. |
| Chip (not a public piece) | Internal piece `nph-multi-combobox / chip`, used only inside the field. `state` `default` \| `foco-remover` \| `disabled`, default `default`. `rótulo` is the option text. |
| `ícone início` (on the chip) | Boolean, off by default. It turns on an icon before the chip label, the same icon as the option in the list. Avatar does not go in the chip. |
| `⮑ ícone` (on the chip) | Swappable `nph-icon` instance, used when `ícone início` is on. Default `tag`. |
| Error message and help (not properties) | They belong to `nph-field`. |

## Relations and context
- Inside `nph-field`, which gives the label, the support text and the error
  message. The field controls the color, state and focus of what is inside it.
- The list is the `nph-combobox` list (`nph-combobox / lista`); each option uses
  `marcador=checkbox`, with an `nph-checkbox` instance. The chosen option is
  checked, without the selected background.
- Between the chips, and between the chips and the text, the space is
  `space/inline-tight`.
- The icons come from `nph-icon`. The counter is an `nph-badge`.
- The tag name `nph-multi-combobox` is provisional until the sheet.

## When to use
- When the person picks several options from a closed list, such as people,
  teams or tags.
- When seeing what is already chosen, in the field itself, helps to check and to
  remove.
- `default` in most forms; `large` when the form uses tall fields.
- `conteúdo=contador` when the field needs to stay on one line, as in a filter,
  a table or a toolbar; the open list shows every choice.
- Several lines in a form, when the person needs to check each choice without
  opening the list.
- `ícone início` on the chip when the options are of different kinds, such as
  tag and team; the icon repeats the one of the option in the list.
- For a single option, use `nph-select` or `nph-combobox`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Two options chosen, at rest | Chips on one line. |
| In focus, with typed text and the list open | `conteúdo=digitando` and the list with checkboxes. |
| Many options | The chips go down to more lines and the field grows. |

## Do
- Let the instance take the width of the form, because the field needs room for
  the chips to stay on the same line.
- Use `nph-field` for label, support and error, so the error text goes with the
  field.
- Let the field grow in height when the chips do not fit, so no chosen option is
  hidden.
- Keep the remove button on each chip, because it is the only way to remove an
  option without opening the list.

## Do not
- Do not use it to pick a single option. Use `nph-select` or `nph-combobox`.
- Do not use it for free text or options that are not in the list. Use
  `nph-input`.
- Do not cut the chips with a fixed height. Let the field grow or use
  `conteúdo=contador`.
- Do not put an avatar inside the chip. To mark the kind of the option, use
  `ícone início`; the name stays in the label.
- Do not use the counter when the person needs to check each choice. Let the
  chips go to several lines.
- Do not turn on `ícone início` only to decorate. Use it when it helps to
  recognize the kind of the option.
- Do not fix the width in pixels. Use `layout/multi-combobox-width` or the width
  of the form.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-15.md`: decision on the pill chip
and on the chip start icon, Figma UX QA approved, acceptance of the chip and of
the documentation board, and textual audit approved.
