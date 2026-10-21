```json
{
  "task": "DSA-46",
  "gate": "figma-docs-accepted",
  "date": "2026-10-14",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1359-142",
    "date": "2026-10-14",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-combobox board (1359:142), with its `Documentação` frame (1766:2400), on the page `NPH — Combobox` (1359:2), was accepted as the API and behavior specification of the nph-combobox. COMPONENT_SET: nph-combobox (1359:115), variants `size`, `state`, `início` and `conteúdo`, with the properties `valor`, `limpar` and the swap property `ícone início`. Internal piece: `nph-combobox / lista` (1359:141), with the variant `state` and the boolean `atalhos`. Each option is `nph-select / opção` (1357:136)."
  }
}
```

# DSA-46 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-combobox` board (`1359:142`,
documentation `1766:2400`) on 14-10-2026, in the file `DS-IA-NEPHOS 5.0`. The
Figma UX QA and the textual audit were approved on 14-10-2026. The component
needed one new token, `text/highlight-weight`, taken to `v/5.0.0` on 14-10-2026
(`28336a6`). `radius/control-inner` and `layout/max-list-height` came with
DSA-29. Every other token it uses was already on `v/5.0.0`; on 21-10-2026 every
variable bound in the `nph-combobox` page was read in Figma and compared with
`semantic.tokens.json`, with the same aliases in light and dark.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A field where the person types to filter a list of options and picks one.

Selection: `nph-combobox` — properties `size`, `state`, `início`, `ícone início`,
`conteúdo`, `valor` and `limpar`. The list is `nph-combobox / lista`, with
`state` and `atalhos`.

## Description
Use it when the list is long and searching by name is faster than scrolling. The
chosen option shows as text in the field, with a button to clear it. It does not
replace `nph-select`, for short lists without search, nor `nph-multi-combobox`,
for several options. It accepts text outside the list only when the list offers
the create row.

## Anatomy

| Part | Rule |
|---|---|
| 1. Start | Magnifying glass, icon or avatar at the beginning of the field. The magnifying glass and the icon are decorative; the avatar helps recognize the option. |
| 2. Text | The placeholder with no chosen option, the text typed while searching, or the chosen option. |
| 3. Clear | Button that erases the chosen option or the typed text. |
| 4. Divider | Vertical line in `color/border` that separates the text from the arrow area. |
| 5. Arrow area | Background `color/accent` fitted into the border. The arrow points down with the list closed and up with the list open. |
| 6. List | `nph-combobox / lista`. Opens below the field and shows results, groups, search, status, loading, create or empty, with an optional footer of shortcuts. |
| 7. Focus ring | Appears when the field or the clear button receives focus, and stays with the list open. |

The field has the same box as `nph-select`: background `color/background`,
border `border/width` in `color/input`, radius `radius/control`, width
`layout/input-width`, height `control/height-default` (or `control/height-large`),
left padding `space/control-padding`, gap `space/inline`, right padding 0. The
arrow area is as wide as the height (`control/height-default` or
`control/height-large`) and has `radius/none` on the left corners and
`radius/control-inner` on the right corners. Start icon, arrow and clear icon
are `nph-icon` in `icon/size-sm`; the arrow is `chevron-down` and, with the list
open, `chevron-up`. The list uses `color/popover` and `radius/container`, with
the maximum height `layout/max-list-height`. The selected option keeps
`color/primary-surface` with the check in `color/primary`.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text, placeholder, icons and border pass the minimum contrast, in light and dark. The arrow keeps 3:1 on the `color/accent` background. In the search highlight, the stretch outside the term uses `color/muted-foreground` and also passes 4.5:1. |
| Visible focus | The focused field changes the border to `focus/border` and gains the focus ring; it stays so with the list open. On the clear button, the ring follows only the button. |
| Color is not the only signal | The error comes with the message of `nph-field`. The status dot goes with the written label. The search highlight changes the weight of the text. When the list opens, the arrow also turns up. |
| Touch target | The whole field is the target that opens, with the height of the chosen size; the arrow area is part of it. The clear button has its own area, larger than the icon: `icon/size-sm` with `space/inline-tight` around it. |
| Accessible name | The label comes from `nph-field`. The magnifying glass, the arrow, the divider and the status dot are `aria-hidden`. The clear button has only an icon and carries `aria-label`; the text it reads is defined in the repository, with the behavior. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `default` \| `large`, default `default`. Changes the field height and the arrow area width; `default` is the standard. |
| `state` | `default` \| `hover` \| `foco` \| `aberto` \| `erro` \| `erro-foco` \| `disabled` \| `foco-limpar`, default `default`. `aberto` is `foco` with the list open and the arrow up. `foco-limpar` is the focus on the clear button. `hover`: border `color/input-hover`; `foco`: border `focus/border` and halo `focus/halo`; `erro`: border `status/error`; `erro-foco`: border `status/error` and halo `focus/halo-error`; `disabled`: background `color/muted`, opacity `state/disabled-opacity`. |
| `início` | `lupa` \| `ícone` \| `avatar`, default `lupa`. With `ícone`, the property `ícone início` chooses which one shows. |
| `conteúdo` | `placeholder` \| `valor` \| `digitando`, default `placeholder`. `digitando` exists only in the states with focus. |
| `valor` | Text of the chosen option, shown with `conteúdo=valor`. |
| `limpar` | Shows or hides the clear button. |
| List (not a property of the field) | `nph-combobox / lista`: `state` `resultados` \| `vazio` \| `grupos` \| `busca` \| `status` \| `carregando` \| `criar`; `atalhos` shows the footer with the keys. |
| Option with dot (not a property of the field) | In the status list, the option is `nph-select / opção` with `início=ponto`; the dot color comes from `status/*`. |
| Error message and help (not properties) | They belong to `nph-field`. |

### List, by state

| State | What it shows |
|---|---|
| `resultados` | The options that match, as `nph-select / opção`. |
| `busca` | Results with the typed stretch highlighted in `text/highlight-weight` (600); the rest of the text in `color/muted-foreground`. |
| `status` | Options with the status dot and the written label. |
| `grupos` | Results under group labels, separated by the group label and the separator of `nph-dropdown-menu`. |
| `carregando` | The `nph-spinner` while the search answers. |
| `criar` | The create row, which offers the typed text as a new item; the results above it show the typed stretch highlighted. Only for a list that accepts new items. |
| `vazio` | The `nph-empty`, when nothing matches in a closed list. |
| `atalhos` | Optional footer with the keys, as `nph-kbd`. |

## Usage
The component has no code yet; the attributes come with the sheet. The tag name
is provisional.

```html
<nph-combobox></nph-combobox>
```

```ts
import 'nephos/nph-combobox';
```

## Relations and context
- It sits inside `nph-field`, which gives the label, the help text and the error
  message. The field controls the color, state and focus of what is inside it.
- The list is `nph-combobox / lista` and each option is `nph-select / opção`.
  The empty state uses `nph-empty`; loading uses `nph-spinner`; shortcuts use
  `nph-kbd`; groups use the group label and the separator of `nph-dropdown-menu`.
- The arrow area uses `color/accent` and fits into the border with
  `radius/control-inner`; the divider uses `color/border`.
- The icons come from `nph-icon`.

## When to use
- When the list is long and the person knows the name of what they look for.
- `default` in most forms; `large` when the form uses tall fields.
- Status list when each option has a state; create only when the list accepts
  new items; shortcuts on screens used a lot by keyboard.
- For a short list, use `nph-select`. For several options, use
  `nph-multi-combobox`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Chosen option, at rest | The value in the field, with the clear button. |
| Search with the typed stretch highlighted | The `busca` list. |
| Search waiting for the answer | The `carregando` list. |

## Do
- Show the searched stretch highlighted in the list — the person checks the
  result faster.
- Write the state in the label when using the status dot — the color only
  reinforces it.
- Show the list loading while the search answers — the person knows the search
  is running.
- Use `nph-field` for label, help and error — the error text goes with the field.

## Do not
- Do not use it for several options. Use `nph-multi-combobox`.
- Do not use it for a short list that fits on the screen without search. Use
  `nph-select`.
- Do not offer create in a closed list. Use `nph-combobox / lista` with
  `state=vazio`.
- Do not change the color of the arrow area. It uses `color/accent`; for an
  error, use `state=erro`.
- Do not use the status dot without a label. Write the state in the option text.

## Decisions of 14-10-2026 that shape the contract
- The divider sits before the arrow area, with no space between the divider and
  the arrow, and 8 px between the content of the field and the divider so it does
  not touch it.
- The arrow area uses `color/accent` (Tone 1, chosen by Indiane).
- The check of the selected option is in `color/primary`, in the shared
  `nph-select / opção`.
- `state=aberto` is `foco` with the list open and the arrow up.
- The status dot is the `início=ponto` of the shared `nph-select / opção`.
- The weight of the search highlight is the token `text/highlight-weight`.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-14.md`: visual acceptance of the
modern combobox, Figma UX QA approved, acceptance of the documentation board
(`1766:2400`) and textual audit approved; decision on the check in
`color/primary` and on `text/highlight-weight`.
