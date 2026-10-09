```json
{
  "task": "DSA-22",
  "gate": "figma-docs-accepted",
  "date": "2026-10-07",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-07",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-togglebutton frame (1512:27498), on the page `NPH — ToggleButton`, was accepted as the API and behavior specification of the nph-togglebutton. COMPONENT_SET: nph-togglebutton (1512:719), variants `marcado`, `state`, `desabilitado`, `texto`, `invalido` and the boolean properties `ícone início` and `ícone fim`."
  }
}
```

# DSA-22 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-togglebutton` board (`1512:27498`)
on 07-10-2026, in the file `DS-IA-NEPHOS 5.0`, page `NPH — ToggleButton`. The
Figma UX QA was approved on 07-10-2026 and the textual audit on 08-10-2026. The
component needs no new token: every token it uses was already on `v/5.0.0`.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A button that holds a boolean value: on or off (`marcado`).

## Description
Use it when the person turns an option on or off with a button, with text or
with an icon only. The on state shows a raised inner area with an outline.
It does not replace `nph-button`: `nph-button` fires an action; `nph-togglebutton`
holds a state. For an option that turns on or off, the choice depends on the place:

- in a toolbar, with an immediate effect and among other buttons: `nph-togglebutton`;
- outside a toolbar, in a setting that turns on or off with an immediate effect: `nph-switch`;
- in a form, when the choice goes with the submission: `nph-checkbox`.

## Anatomy

| Part | Rule |
|---|---|
| Track | The outer box: background `color/muted`, border `border/width` in `color/muted`; when invalid, the border becomes `status/error`. |
| Inner area | The inner area with the content. When on: background `color/background`, shadow `elevation/subtle` and an outline in `color/primary-border` at `border/width`. |
| Start icon | Optional, turned on by the `ícone início` property. Off shows `xmark`; on shows `check`. |
| Label | The text, in `text/label-md`: `color/muted-foreground` when off; `color/foreground` when on or on hover. |
| End icon | Optional, turned on by the `ícone fim` property, with the same swap as the start icon. |
| Focus | Border `color/primary` and halo `focus/halo` outside the piece; when invalid, border `status/error` and halo `focus/halo-error`. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `marcado` | `não` \| `sim`, default `não`. Off: track and inner area have the same background. On: the inner area is raised, with an outline. |
| `state` | `default` \| `hover` \| `foco` \| `hover-foco`, default `default`. On hover, the label and icon of the off piece go from `color/muted-foreground` to `color/foreground`. Focus adds border and halo. |
| `desabilitado` | `não` \| `sim`, default `não`. The whole piece gets `state/disabled-opacity`. Exists only with `state` `default` and not invalid. |
| `texto` | `não` \| `sim`, default `não`. Without text, the piece shows a single icon and needs an accessible name. |
| `invalido` | `não` \| `sim`, default `não`. Border `status/error`; on focus, the error border and halo. |
| `ícone início` · `ícone fim` | Boolean, default on. Turn each icon of the piece with text on or off. |
| Not a property | The label text and the icon change in the instance. Size is not a property: the height comes from `control/height-default`. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Label and icon pass 4.5:1 on their own background in both modes. The outline of the on inner area passes 3:1 on the track. |
| Visible focus | In the `foco` and `hover-foco` states, border `color/primary` and halo `focus/halo` outside the piece; when invalid, border `status/error` and halo `focus/halo-error`. |
| Color is not the only signal | The on state shows in the raised inner area with an outline, not only in the text color. The invalid piece changes its border; the error message stays outside the piece. |
| Touch target | The whole piece is the target: 36 px high, in `control/height-default`, with or without text. |
| Accessible name | With text, the name comes from the label. Icon only, the piece takes `aria-label` and the icon gets `aria-hidden`. |

## Relations and context
- `nph-toggle-group` is made of `nph-togglebutton` instances, separated by `space/inline`.
- The icons are `nph-icon` instances, in `icon/size-sm`.
- Color, state and focus come from the variants; the screen does not override color in the instance.
- When the piece is invalid, the error message stays outside it.

## When to use
- With text, when the option name must be visible.
- Icon only, when the icon is recognized without a caption; the piece takes an accessible name.
- Start and end icons are optional; without them, the outlined inner area still shows the state.
- In a toolbar, with an immediate effect and among other buttons. Outside a toolbar, in a setting that turns on or off with an immediate effect, use `nph-switch`; in a form, when the choice goes with the submission, use `nph-checkbox`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Option off | Off, with text. |
| Option on | On, with text and icons. |
| Icon set | Icon only, side by side, one on. |

## Do
- Give the icon-only piece an accessible name, because the screen reader does not read the drawing.
- Change text and icon in the instance, because they are not properties of the set.
- Use `desabilitado=sim`, because the opacity comes from the `state/disabled-opacity` token.
- Separate neighboring pieces with `space/inline`, as in `nph-toggle-group`.

## Do not
- Do not use it to fire an action: use `nph-button`.
- Do not mark the state by changing only the text color: use `marcado=sim`.
- Do not put neighboring pieces together without space: use `space/inline`.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-07.md`: visual acceptance, Figma UX QA
round 2 approved and acceptance of the documentation board. `2026-10-08.md`:
textual audit approved.
