```json
{
  "task": "DSA-27",
  "gate": "figma-docs-accepted",
  "date": "2026-10-08",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1549-2",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-switch frame (1549:2), on the page `NPH — Switch`, was accepted as the API and behavior specification of the nph-switch. COMPONENT_SET: nph-switch (1548:56), properties `marcado`, `state` and the boolean property `mostrar rótulo`."
  }
}
```

# DSA-27 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-switch` frame (`1549:2`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Switch`. Indiane accepted the visual and the documentation on 08-10-2026; the Figma UX QA and the textual audit (round 2) were approved on 08-10-2026. The `switch/track-width` token is on `v/5.0.0`.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A switch that turns a setting on or off, with an immediate effect.

## Description
Use `nph-switch` when the person turns a setting on or off and the effect happens immediately, outside a toolbar. The position of the knob shows the state: left, off; right, on. The choice among the on/off pieces depends on the place: outside a toolbar, in a setting with an immediate effect, use `nph-switch`; in a toolbar, among other buttons, use `nph-togglebutton`; in a form, when the choice only counts on submission, use `nph-checkbox`.

## Anatomy

| Part | Rule |
|---|---|
| Track | The rounded base, in `radius/full`, with width `switch/track-width` and height `icon/size-lg`. Off: background `color/input`; on: background `color/primary` with an outline `color/primary-border`; on hover: background `color/input-hover` off and `color/primary-hover` on; with an error: outline `status/error`. |
| Knob | The circle in `icon/size-sm`, `space/inline-tight` from the track edge. Off: on the left, in `color/background`; on: on the right, in `color/primary-foreground`. |
| Label | The text next to it, in `text/label-md` and `color/foreground`, `space/inline` from the track. It is the name of the control and part of the piece. |
| Touch area | The whole track, `switch/track-width` × `icon/size-lg`; with a label, the whole piece. |
| Focus | Border `focus/border` on the track and halo `focus/halo` outside it; with an error, border `status/error` and halo `focus/halo-error`. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The track edge meets 3:1 against the background in every state except `disabled` (WCAG 1.4.11): `color/input` off (`color/input-hover` on hover) and `color/primary-border` on. The knob meets 3:1 against the track. |
| Visible focus | In the `foco` and `erro-foco` states, the focus border and halo show around the track, for keyboard users. |
| Color is not the only signal | On and off show in the knob position, not only in the track color; the error has the sentence written outside the piece. |
| Touch target | The whole track is the target, `switch/track-width` × `icon/size-lg`; with a label, the whole piece. |
| Accessible name | The label is the name of the control. With `mostrar rótulo` off, the piece is only the track and the name comes from `aria-label`. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `mostrar rótulo` | Boolean, default on. Off, the piece is only the track and needs an accessible name. |
| `marcado` | Variant, default `false`. Values: `false` \| `true`. `true` turns the setting on: the knob goes right and the track goes to `color/primary`. |
| `state` | Variant, default `default`. Values: `default` \| `hover` \| `foco` \| `erro` \| `erro-foco` \| `disabled`. `erro` shows something must be fixed; the error sentence stays outside the piece. `erro-foco` is the error with the keyboard on the track. `disabled` applies `state/disabled-opacity` to the whole piece and does not exist with an error. |
| Not a property | The label text changes in the instance. There is no size: the track is always `switch/track-width` × `icon/size-lg`. There is no group: several `nph-switch` stack, one per line. |

## Relations and context
- In a toolbar, among other buttons, the piece is `nph-togglebutton`; in a form that only counts on submission, it is `nph-checkbox`.
- Several settings stack, one `nph-switch` per line; there is no group component.
- `nph-switch` brings its own text: it does not need `nph-field` to have a name.
- `nph-switch` controls its own color, state and focus by tokens; the space to the label is `space/inline`.

## When to use
- For a setting that turns on or off, with an immediate effect, outside a toolbar.
- When the choice only counts on a form submission, use `nph-checkbox`.
- In a toolbar, among other buttons, use `nph-togglebutton`.
- `mostrar rótulo` off only when the name is already in the context, such as a table cell, always with `aria-label`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Single setting | One option that turns on or off, with an immediate effect. |
| Preferences | Several settings stacked, one per line. |
| Unavailable setting | Disabled: the person cannot change the setting. |

## Do
- Use it for a setting that turns on or off with an immediate effect, because the person sees the result without submitting anything.
- Stack several settings, one `nph-switch` per line, because there is no group component.
- Keep the error message outside the piece, because the `erro` state only changes the track outline.
- Hide the text by the `mostrar rótulo` property, instead of deleting it, because the accessible name is still needed.
- Use `state=disabled`, because the opacity comes from the `state/disabled-opacity` token.

## Do not
- Do not use it in a form whose choice only counts on submission: use `nph-checkbox`.
- Do not use it among toolbar buttons: use `nph-togglebutton`.
- Do not paint the track or the knob by hand: use `marcado` and `state`.
- Do not delete the label text to hide it: use `mostrar rótulo` off.

## Source of the acceptance
WORK BRAIN — `2026-10-08.md`: Figma UX QA approved, acceptance of the visual and the documentation, textual audit approved in round 2.
