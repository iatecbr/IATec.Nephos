```json
{
  "task": "DSA-43",
  "gate": "figma-docs-accepted",
  "date": "2026-10-20",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2122-1591",
    "date": "2026-10-20",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-icon-button documentation frame (2128:3953), inside the board 2122:1591 on the page `NPH — Icon Button`, was accepted as the specification of the icon-only button. COMPONENT_SET 498:15671, named `nph-icon-button` in Figma; in code it is the nph-button without text."
  }
}
```

# DSA-43 — `figma-docs-accepted`

Indiane accepted the visual of the `nph-icon-button` set and its documentation
board (`2122:1591`) in the file `DS-IA-NEPHOS 5.0`, page `NPH — Icon Button`, on
19-10-2026. The Figma QA was approved by an independent review the same day. The
textual audit was approved on 20-10-2026, in its third round. The component needs
no new token: every token it uses is on `v/5.0.0` with the same value as Figma.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A button that triggers an action with a single icon and no visible text.

Selection: `nph-icon-button` — properties `tipo`, `enfase`, `size`, `state`,
`forma` and the icon. In code, it is the `nph-button` without text.

Figma property to code attribute of the `nph-button`: `tipo` → `severity`,
`enfase` → `emphasis`, `size` → `size`, `state` → `disabled` and `loading`
(hover and focus are browser states), icon → `icon-start` or `icon-end`.
`forma` has no attribute yet: this task creates it.

## Description
Use it for a universal, recognizable action without text, such as close, search
or open more options. The icon says the action and the accessible label gives
its name. It does not replace the `nph-button` when the action needs text, nor
field validation, which belongs to `nph-field`.

## Anatomy

| Part | Rule |
|---|---|
| 1. Container | Width and height on the same token: `control/height-compact`, `control/height-default` or `control/height-large`. No inner padding. Corners `radius/control` in the square shape and `radius/full` in the circular shape. |
| 2. Icon | From the `nph-icon` set, centered. It follows the box: `icon/size-sm` in compact, `icon/size-md` in default and `icon/size-lg` in large. |
| 3. Spinner | In the `carregando` state, the `nph-spinner` takes the icon's place. |
| 4. Focus ring | Shown in the `foco` state, for keyboard users. In the circular shape, the border and the halo follow the round corners (`radius/full`). |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Icon against background passes 3:1, the non-text criterion, in every type and emphasis and in both modes. |
| Visible focus | In the `foco` state the border and the halo appear for keyboard users; the border passes 3:1 against the background. |
| Color is not the only signal | The action is said by the icon and the accessible label; type, focus and state never depend on color alone, and `carregando` swaps the icon for the spinner. |
| Touch target | The whole box is the target: 28 px in compact, 36 px in default and 44 px in large. Only large meets the 44 px touch target; compact is never the main target on a touch screen. |
| Accessible name | Without visible text the label is required and is the name read by the screen reader. Without it, the component fails validation. Sighted users read the action name in a tooltip, required on every icon-only button. |

Demonstrations: focus visible for keyboard users; large meets 44 px of touch;
accessible label required (circular, secondary ghost).

## Properties, variants and states

| Field | Rule |
|---|---|
| icon (instance swap) | Default `nome=plus`, `estilo=light`. Which icon. Only icons of the `nph-icon` set; the icon follows the box. |
| `tipo` | Variant, default `primary`. Values: `primary`, `secondary`, `info`, `warn`, `help`, `danger`, `success`. Chosen by the meaning of the action, never by color. |
| `enfase` | Variant, default `solid`. Values: `solid`, `outline`, `light`, `ghost`. How much the action stands out. `outline`, `light` and `ghost` exist only for `primary`, `secondary` and `danger`. |
| `size` | Variant, default `default`. Values: `compact`, `default`, `large`. The box has the same width and height: 28, 36 and 44 px. Large meets the 44 px touch target. |
| `state` | Variant, default `default`. Values: `default`, `hover-active`, `foco`, `disabled`, `carregando`. Response to the mouse, the keyboard, being off and processing. `disabled` uses `state/disabled-opacity`, as in the `nph-button`. Field error is not a button state. |
| `forma` | Variant, default `quadrado`. Values: `quadrado` (square), `circular`. Square uses `radius/control`; circular uses `radius/full`. The shape changes neither the size nor the touch target. |
| accessible label | Not a set property. Comes from the `label` attribute of the `nph-button`; required without visible text. |
| tooltip | Not a set property. The action name appears in an `nph-tooltip` next to the button; required on every icon-only button. |
| text | Does not exist in this set. With visible text, use the `nph-button`. |

Demonstrations: `forma = quadrado`; `forma = circular`; `state = carregando`
(circular).

## Usage
Import once and write the tag. Without text, the icon goes in `icon-start` and
the action name in `label`.

```html
<nph-button icon-start="xmark" label="Fechar"></nph-button>
```

```ts
import 'nephos/nph-button';
```

The circular shape and the tooltip are not in the code yet: see the task.

## Relations and context
- The icon comes only from the `nph-icon` set and follows the box: sm in compact,
  md in default and lg in large.
- In the `carregando` state the button shows the `nph-spinner` in place of the
  icon.
- In code it is the same `nph-button` without text: the separate set exists only
  in Figma.
- Field validation belongs to `nph-field`, not to the button.
- Every icon-only button carries an `nph-tooltip` with the action name.

## When to use
- For a universal, recognizable action without text, such as close, search or
  open more options.
- `tipo` by the meaning of the action, never by color.
- `enfase` by how much the action stands out: solid, outline, light or ghost.
- `size` large on touch screens; compact never as the main touch target.
- In the actions column of a table, even when the action leads to another
  screen, such as view details.
- `forma`: square and circular are a choice of context, with no fixed rule.
- `info`, `warn`, `help` and `success` exist only in solid.

| Size | When to use | When not to use |
|---|---|---|
| compact (28 px) | Inside a table, toolbar or filter. | As the main target on a touch screen; with a size different from the field beside it. |
| default (36 px) | In every other case; it is the default. | With a size different from the field beside it. |
| large (44 px) | On touch screens and in the main form; meets the 44 px touch target. | With a size different from the field beside it. |

## Required examples (light and dark)
1. Actions of a table row, in compact: three `secondary` `ghost` buttons.
2. Closing a panel: universal action without text (`secondary` `ghost`,
   default).
3. Circular shape, with accessible name (`primary` `solid`, default).

## Do
- Use it for a universal, recognizable action without text, such as close or
  search.
- Give every icon-only button its accessible label: it is required.
- Keep the icon at the box size: sm in compact, md in default and lg in large.
- Change `tipo`, `enfase`, `state` and `forma` through the properties, never by
  detaching the instance.
- Show the action name in a tooltip on every icon-only button. The
  demonstration shows the tooltip "Fechar" above the button, at `space/inline-tight`.

## Do not
- Use an icon only for an action with consequence, such as delete or publish,
  outside the actions column of a table: use the `nph-button` with text. In the
  actions column, the tooltip gives the name.
- Leave the button without an accessible label: without it the component fails
  validation.
- Enlarge the icon to stand out: it follows the box.
- Use color as the only signal of type, focus or state: the icon and the label
  say the action.
- Leave an icon-only button without a tooltip: whoever sees only the icon does
  not know what it does.

Demonstrations of the errors: icon only on an action with consequence
(`danger`); icon only, without tooltip; two buttons told apart only by color
(`info` and `warn`).

## Tokens

| Part | Tokens |
|---|---|
| Box | `control/height-compact`, `control/height-default`, `control/height-large` |
| Corners | `radius/control` (square), `radius/full` (circular) |
| Icon | `icon/size-sm`, `icon/size-md`, `icon/size-lg` |
| Color | the same `color/*` and `status/*` tokens of the `nph-button` for each type and emphasis |
| Focus | `focus/border`, `focus/halo`, `focus/halo-danger`, `focus/halo-help`, `focus/halo-info`, `focus/halo-success`, `focus/halo-warn`, `focus/ring-width`, `focus/border-radius-control`, `focus/radius-control-with-border`, `border/width`; in the circular shape, `radius/full` |
| Disabled | `state/disabled-opacity` |
