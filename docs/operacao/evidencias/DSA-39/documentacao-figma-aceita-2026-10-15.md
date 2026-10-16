```json
{
  "task": "DSA-39",
  "gate": "figma-docs-accepted",
  "date": "2026-10-15",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1636-46",
    "date": "2026-10-15",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-slider board (1636:46), on the page `NPH — Slider` (1626:10), with its `Documentação` frame (1925:642), was accepted as the API and behavior specification of the nph-slider. COMPONENT_SET: nph-slider (1636:44), variants `orientacao`, `tipo` and `state`, and the booleans `rótulo e valor`, `mínimo e máximo`, `marcas`, `campo` and `menos e mais`. Variant matrix: 1636:52."
  }
}
```

# DSA-39 — `figma-docs-accepted`

The documentation of the `nph-slider` board (`1636:46`) was accepted in Figma,
in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit
approved. The component needed no new token: every token it uses was already on
`v/5.0.0`, with the same values as in Figma.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Picks a value, or a range, on a continuous scale of numbers, by dragging the
thumb or with the arrow keys.

Selection: `nph-slider` — properties `orientacao` (`horizontal`, `vertical`),
`tipo` (`simples`, `intervalo`) and `state`, and the optional parts
`rótulo e valor`, `mínimo e máximo`, `marcas`, `campo` and `menos e mais`
(`marcas`, `campo` and `menos e mais` only in the horizontal orientation).

## Description
Use it when the position on the scale matters more than the exact number:
volume, brightness, price range. When the exact number matters, turn on `campo`
or use `nph-input`. It does not show progress: that is a progress bar, which is
not operated.

## Anatomy
Shown with `orientacao=horizontal`, `tipo=simples`, `state=foco`, with
`rótulo e valor`, `mínimo e máximo` and `campo` on.

| Part | Rule |
|---|---|
| Root | Vertical stack, gap `space/stack-tight` between the top line, the track and the marks. Default width `layout/input-width`. |
| 1. Track | Empty part in `color/input` and active part in `color/primary`, `space/inline-tight` thick, radius `radius/full`. In `tipo=intervalo`, the active part sits between the two thumbs, with an empty part on each side. |
| 2. Thumb | Circle `icon/size-sm` wide and high, radius `radius/full`, background `color/background`, border `border/width` (inside) in `color/primary-border`. Its touch target is a circle `control/height-large` wide, centered on the thumb. In `tipo=intervalo` there are two thumbs, start and end. |
| 3. Value balloon | An `nph-tooltip` above the thumb, shown in `hover`, `foco` and `erro-foco`. It keeps the `nph-tooltip` tokens: background `color/tooltip`, padding `space/inline` horizontal and `space/inline-tight` vertical, maximum size `layout/max-tooltip-width` and `layout/max-tooltip-height`, shadow `shadow/color`. In `tipo=intervalo`, it follows the thumb that has the state. |
| 4. Label and value (`rótulo e valor`) | Optional. An `nph-label` on the left and the current value on the right, above the track. Value in `text/label-md`, `color/foreground`. |
| 5. Minimum and maximum (`mínimo e máximo`) | Optional. The limits at the ends of the track, in `text/caption`, `color/muted-foreground`. In the vertical orientation the minimum is at the bottom and the maximum at the top. |
| 6. Marks (`marcas`) | Optional, horizontal only. Steps under the track, in `text/caption`, `color/muted-foreground`, `space/stack-tight` below the track. |
| 7. Field (`campo`) | Optional, horizontal only. An `nph-input` (`size=default`) with the number, `space/inline` from the track; in `tipo=intervalo`, one at each end (start and end). |
| 8. Minus and plus (`menos e mais`) | Optional, horizontal only. Icon-only `nph-button`, `tipo=secondary`, `enfase=ghost`, `size=default`, with `nph-icon` `minus` and `plus` (Light). Each click moves one step. `space/inline` from the track. |

Between the track and the parts beside it (minimum and maximum, field, minus and
plus), the gap is `space/inline`.

### Thumb, token by state

| `state` | Thumb border | Focus halo | Value balloon | Field (`campo`) |
|---|---|---|---|---|
| `default` | `color/primary-border` | none | hidden | `nph-input` `state=default` |
| `hover` | `color/primary-border` | none | shown | `nph-input` `state=default` |
| `foco` | `focus/border` | `focus/ring-width` in `focus/halo`, radius `radius/full`, around the thumb | shown | `nph-input` `state=default` |
| `disabled` | `color/primary-border` | none | hidden | `nph-input` `state=default`; the whole slider at `state/disabled-opacity` |
| `erro` | `status/error` | none | hidden | `nph-input` `state=erro` |
| `erro-foco` | `status/error` | `focus/ring-width` in `focus/halo-error`, radius `radius/full`, around the thumb | shown | `nph-input` `state=erro` |

The track does not change with the state: the active part stays `color/primary`
and the empty part `color/input`.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The thumb border passes 3:1 against the background, in both modes and in every theme. The active part of the track is support: in dark mode it may fall below 3:1, and the visible limit of the control is the thumb. Support texts pass 4.5:1. |
| Visible focus | The thumb in focus gains the border `focus/border` and the halo `focus/halo`; in error, the border `status/error` and the halo `focus/halo-error`. In dark mode, `focus/border` has the same tone as `color/primary-border`, and the halo is what changes. |
| Color is not the only signal | The error appears inside `nph-field`, with the message in text. The current value appears as a number: in the balloon, in the label or in the field. |
| Touch target | The thumb is drawn at `icon/size-sm`, but the target is a circle `control/height-large` wide, centered on it. Minus and plus use `nph-button` in `size=default`. |
| Accessible name | The name comes from the label: `nph-label` or the `nph-field` label. In `tipo=intervalo`, each thumb has its own name, start and end. Minus and plus carry an `aria-label`. |

Demonstrations in the frame, in light and dark: focus (`focus/border` and
`focus/halo`); error with focus inside `nph-field` (`status/error` and
`focus/halo-error`); minus and plus in `nph-button` `size=default`.

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `orientacao` | `horizontal` \| `vertical`, default `horizontal`. The vertical one serves a narrow panel, such as volume or zoom; the minimum is at the bottom. In the vertical one, only `rótulo e valor` and `mínimo e máximo` exist. |
| `tipo` | `simples` \| `intervalo`, default `simples`. `simples` picks one value. `intervalo` picks start and end, with two thumbs. |
| `state` | `default` \| `hover` \| `foco` \| `disabled` \| `erro` \| `erro-foco`, default `default`. `hover`, `foco` and `erro-foco` show the value balloon. `erro` only inside `nph-field`. Tokens per state in the table above. |
| `rótulo e valor` | Boolean, off by default. Turns on the `nph-label` and the current value above the track. It stays off inside `nph-field`, which already gives the label. |
| `mínimo e máximo` | Boolean, off by default. Turns on the limits at the ends of the track. |
| `marcas` | Boolean, off by default. Turns on the steps under the track. Horizontal only. |
| `campo` | Boolean, off by default. Turns on the `nph-input` with the value; in `tipo=intervalo`, one at each end. Horizontal only. |
| `menos e mais` | Boolean, off by default. Turns on the buttons that move one step. Horizontal only. |
| Value, limits and step (not properties) | They come from the code. In Figma, the text of the value, the limits and the marks is edited by hand. |
| Value balloon (not a property) | It shows by itself in `hover`, `foco` and `erro-foco`. |
| Width (not a variant) | The default is `layout/input-width`. |

Demonstrations in the frame, in light and dark: `tipo=simples` (one value),
`tipo=intervalo` (start and end), `orientacao=vertical` (the minimum at the
bottom).

## Usage
Code: `<nph-slider></nph-slider>`. Import: `import 'nephos/nph-slider';`. The
attributes come with the spec.

## Relations and context
- Inside `nph-field`, the field gives the label, the support text and the error
  message; on the slider, `rótulo e valor` stays off.
- The balloon is `nph-tooltip`, the field is `nph-input` and minus and plus are
  icon-only `nph-button`. Each part keeps its own state and its own focus.
- Space: `space/stack-tight` between the top line, the track and the marks;
  `space/inline` between the track and the parts beside it.

Demonstrations in the frame, in light and dark: inside `nph-field` (the field
gives the label and the message); `campo` with an `nph-input` at each end,
`space/inline` from the track.

## When to use
- `tipo=simples`: to pick an approximate value on a scale, such as volume or
  brightness.
- `tipo=intervalo`: to filter by range, such as minimum and maximum price.
- `orientacao=vertical`: a narrow panel or a setting that goes up and down, such
  as volume or zoom.
- `rótulo e valor`: outside `nph-field`, when the person needs to see the number
  while adjusting.
- Value balloon: it shows by itself in hover, focus and error with focus; it
  shows the number without taking fixed space.
- `mínimo e máximo`: when the limits are not obvious to the person.
- `marcas`: when only some values are valid, in fixed steps.
- `campo`: when the exact number matters and the person may want to type.
- `menos e mais`: when fine adjustment is common or dragging is hard, as on a
  touch screen.
- Error: inside `nph-field`, when the value breaks the rule; the message says
  what to fix.

Demonstrations in the frame, in light and dark: marks (values in steps); field
(when the exact number matters); minus and plus (fine adjustment of one step).

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Brightness | `rótulo e valor` on. |
| Price range | `tipo=intervalo` with `campo` on. |
| Volume | `orientacao=vertical` with `mínimo e máximo` on. |

## Do
- Always give the slider a name, through the label or `nph-field`, because
  without a name the screen reader does not say what is adjusted.
- Turn on `campo` when the exact number matters, because dragging to an exact
  value is hard.
- Use `marcas` when only some values are valid, because the thumb stops only on
  them.
- Keep the minimum on the left in the horizontal orientation and at the bottom
  in the vertical one, because that is the direction the person expects.

## Do not
- Do not use it to show progress. Use a progress bar, which is not operated.
- Do not use `tipo=intervalo` to pick a single value. Use `tipo=simples`.
- Do not use `orientacao=vertical` in a common form. Use the horizontal one,
  which follows the reading.
- Do not turn on `rótulo e valor` inside `nph-field`: the label comes out
  twice. Leave the label to the field.
- Do not turn on `mínimo e máximo` together with `marcas`: the marks already
  show the limits.
- Do not use `marcas` on a continuous scale. Use `mínimo e máximo`.
- Do not use the slider alone when the person often types exact numbers. Turn on
  `campo` or use `nph-input`.
- Do not use `menos e mais` without a defined step: each click needs to move one
  clear step.
- Do not show the error only through the thumb color. Use `nph-field`, which
  gives the message.
- Do not replace the balloon with a fixed text above the thumb. Use
  `rótulo e valor`.

Each line has a wrong-use demonstration in the frame, in light and dark.

## Source of the acceptance
WORK BRAIN — `03 MEMÓRIA/diario/2026/2026-10-15.md`: modernization accepted,
Figma UX QA approved, documentation board accepted, textual
audit approved, and the token check (nothing to take). WORK BRAIN —
`03 MEMÓRIA/diario/2026/2026-10-16.md`: the nph-slider is sent to code.
