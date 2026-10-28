```json
{
  "task": "DSA-59",
  "gate": "figma-docs-accepted",
  "date": "2026-10-28",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1211-690",
    "date": "2026-10-28",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-input board (1195:532), with its Documentação frame (1211:690), was accepted with the size compact. COMPONENT_SET: nph-input (622:18359), 21 variants (size × state). The compact size, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-59 — `figma-docs-accepted`

The documentation of the `nph-input` with the size `compact` (frame `1211:690`, variant matrix `1195:552`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The compact size needed 2 `input/*` tokens, both put on `v/5.0.0` together with this task:

- `input/height-compact` → `{control.height-compact}` (28 px).
- `input/clear-padding-end` → `{core.space.off-scale.5}` (5 px). The core primitive `core/space/off-scale/5` was added for it.

Every other token the compact size uses was already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the compact size converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma; the code API is in English. The sizes `default` and `large` do not change; they are in `fichas/nph-input.md`.

## Purpose

A 28 px nph-input for the search of the compact nph-toolbar and for the compact table. It is used with mouse and keyboard; it is not for touch.

## Properties

| Field | Rule |
|---|---|
| size | `compact`, `default`, `large`. The set's default variant stays `size=default, state=default`. |
| state | The same seven states in every size: `default`, `hover`, `foco`, `foco-limpar`, `erro`, `erro-foco`, `disabled`. |
| Other properties | Unchanged: `ícone início`, `ícone fim`, `⮑ ícone início`, `⮑ ícone fim`, `texto do valor`, `texto do placeholder`. |

Figma variants of the compact size: `2978:9` (default), `2978:15` (hover), `2978:21` (foco), `2978:28` (erro), `2978:34` (erro-foco), `2978:41` (disabled), `2978:47` (foco-limpar).

## Measures of the compact size

Read from the variant `size=compact, state=default` (`2978:9`), 280 × 28 px in the board:

| Part | Rule |
|---|---|
| Height | `input/height-compact` (28 px). Default is `control/height-default` (36 px) and large is `control/height-large` (44 px). |
| Start padding | `space/control-padding` (12 px), the same as the other sizes. |
| End padding | `input/clear-padding-end` (5 px), in every state of the compact size. In default and large it is `space/control-padding` (12 px). |
| Gap between parts | `space/inline` (8 px). |
| Radius | `radius/control`. |
| Border | `border/width` (1 px). |
| Start icon | nph-icon at `icon/size-sm` (16 px), 12 px from the start border. |
| Value and placeholder | Text role `text/body-md`, the same as the other sizes. Value in `color/foreground`, placeholder in `color/muted-foreground`. |
| Clear button | Target of 24 × 24 px, the same in the three sizes, with `space/inline-tight` (4 px) padding at each side of the icon. The X icon is nph-icon `xmark` at `icon/size-sm`. The drawn X ends 12 px from the end border, so the start icon and the X sit at the same distance from the border. |

The 5 px end padding is what keeps the 24 px target inside the 28 px height and still places the drawn X 12 px from the border: 5 px padding, 4 px target padding and 3 px of empty space inside the 16 px icon box.

## States of the compact size

Every state uses the same tokens as the size `default`; only the height and the end padding change.

| State | Container | Other parts |
|---|---|---|
| default | background `color/background`, border `color/input` | — |
| hover | background `color/background`, border `color/input-hover` | — |
| foco | background `color/background`, border `focus/border` | halo `focus/halo` in `focus/ring-width`, radius `focus/radius-control`, around the field |
| foco-limpar | background `color/background`, border `color/input` | focus ring around the clear button only |
| erro | background `color/background`, border `status/error` | the message is in nph-field |
| erro-foco | background `color/background`, border `status/error` | halo `focus/halo-error` in `focus/ring-width`, radius `focus/radius-control`, around the field |
| disabled | background `color/muted`, border `color/input`, opacity `state/disabled-opacity` (0.5) | no focus, no click |

## Focus ring of the clear button in the compact size

In `foco-limpar` the ring around the clear button has a border `focus/border` of `border/width` (1 px, 26 × 26 px, radius `focus/border-radius-control`) and a halo `focus/halo` of `focus/ring-width` (4 px, 34 × 34 px, radius `focus/radius-control-with-border`), the same ring as in default and large. The two sizes are derived from the 24 px target and the focus widths; they are not tokens.

In the compact size the ring does not fit inside 28 px: the border touches the top and bottom edges of the field, and the halo goes 3 px past the top, the bottom and the end of the field. By decision of Indiane on 2026-10-28 (option 1 of the preview), it stays as it is: the ring goes past the field only while the clear button has focus. Do not clip it and do not shrink it. The container of the field must not cut what is drawn outside it (no `overflow: hidden` on the field or on its wrapper in the toolbar and in the table).

Basis: WCAG 2.4.13 accepts a focus indicator drawn outside the component, and WCAG 2.4.11 does not fail a partly covered indicator at level AA.

## Accessibility

| Criterion | Rule |
|---|---|
| Target | The target is the field itself, 28 px high. The compact size is for mouse and keyboard only, in the compact toolbar and the compact table; it is not for touch. The large size keeps 44 px for screens that need that target. |
| Clear button | Its own target of 24 × 24 px in the three sizes (WCAG 2.5.8). |
| Contrast and focus | The same tokens as default, so the same contrast in light and dark. |

## When to use

- A form uses one size only. Default is for general use.
- Compact is for the search of the compact nph-toolbar and for the compact table, with mouse and keyboard.
- Large is for the screen that needs the 44 px target.
- A field and a button side by side use the same size.

## Demonstrations in the frame

Variant matrix `1195:552`, in light and dark: the seven states in the columns compact, default and large. Section 5 of the frame shows the case `size = compact` in light and dark.
