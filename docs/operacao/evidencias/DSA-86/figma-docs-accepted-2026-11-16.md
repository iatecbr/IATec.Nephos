```json
{
  "task": "DSA-86",
  "gate": "figma-docs-accepted",
  "date": "2026-11-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5123-2641",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-resizable root (5112:1850) and accepted its documentation frame (5123:2641, page 1626:34), with COMPONENT_SET nph-resizable (5112:1849) and COMPONENT_SET nph-resizable handle (5099:172). In the same approval round she answered the 9 items as recommended, none rejected: (1) documentation and appendix accepted; (2) new semantic color/border-strong (core/neutral/600 light, core/surface/200 dark), divider and outline of an area in interaction, with the matching DO NOT USE in color/border and color/input, and resizable/handle-color-hover points to it; (3) resizable/focus-border-width straight to core/focus-width/sm; the focus color (focus/border) and the disabled opacity (state/disabled-opacity) are used directly, with no component token; (4) the grip icon of the horizontal handle is grip-vertical rotated 90 degrees now, and later the dotted grip of Font Awesome enters nph-icon (not grip-lines); (5) an invisible hit area of at least 24 px around the handle line in code, larger on touch, while Figma keeps the thin line; (6) an exception to T4 for the compact size of the collapse button of the handle (28 px); (7) the collapsed panel is an example only, with no variant; (8) out of mobile in v1: below the tablet breakpoint the panels stack or become tabs; (9) the collapse button is on by default, and the documentation tells the product to give a one-tap way out when the handle is the only way to resize. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-86 — `figma-docs-accepted`

The documentation of the nph-resizable (frame `5123:2641`, page `1626:34`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `5112:1850`. It is a group of panels separated by a handle that is dragged to change the size of each panel. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New semantic `color/border-strong` (light `core/neutral/600`, dark `core/surface/200`): divider and outline of an area in interaction, today the line of the nph-resizable handle in hover and dragging. It measures 6.69:1 over `color/background` in light and 9.81:1 in dark. `color/border` and `color/input` now say DO NOT USE on the nph-resizable handle line in hover and dragging, in Figma and in `design.md`. The hover line of the underline nph-tabs (`color/border`) and the hover border of the done nph-file-upload-item (`color/input`) do not change.
- New component group `resizable/*`, 10 tokens in the semantic collection. Nine alias semantics, one of them (`color/border-strong`) new in this task; `resizable/focus-border-width` points straight to `core/focus-width/sm` (2) by decision (rule 3 of T9), as `tree/focus-border-width`: `border/width` is 1, `focus/ring-width` is the halo of 4, and no semantic token has the function of a 2 px focus border.
- No new value entered the core (rule T9).
- Extended `use` in `design.md`: `color/border`, `color/accent`, `color/accent-foreground`, `color/muted-foreground`, `space/inline-tight`, `control/height-compact`, `radius/subtle`, `border/width` and `icon/size-sm`.
- Left without a component token (decided, item 3): the focus color `focus/border`, the disabled opacity `state/disabled-opacity`. The collapse button keeps the tokens of the nph-button.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Where a point is not one of the 9 approval items, it follows the recommendation of the appendix, accepted with the documentation (item 1).

## Purpose

A group of panels side by side or stacked, separated by a handle that is dragged to give more room to one of them, as in an editor with a preview or a list with a reading pane.

Use it in a desktop work area, for long sessions, when the person needs to adjust the space between neighbor contents: editor and preview, list and reading pane, data beside the content.

It does not replace the nph-sidebar, which shows or hides a side area without resizing, nor the nph-separator, which separates and is not dragged. It is not for a reading page nor for a form.

The nph-resizable is out of mobile in v1: below the tablet breakpoint the handle does not show, and the panels stack or become tabs (item 8).

Selection in Figma: `direcao` (horizontal or vertical) and `paineis` on the group; `orientacao`, `state` and `botão recolher` on the handle.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-resizable (the group) | `5112:1849` | `direcao` (`horizontal` default, `vertical`) × `paineis` (`2` default, `3`). 4 variants: `5112:1813` horizontal · 2, `5112:1826` horizontal · 3, `5112:1835` vertical · 2, `5112:1848` vertical · 3. Each variant is panel · handle instance · panel (· handle · panel). |
| `nph-resizable / alça` (the handle) | `5099:172` | `orientacao` (`vertical` default, `horizontal`) × `state` (`default`, `hover`, `arrastando`, `foco`, `disabled`), and the boolean `botão recolher` (on by default). 10 variants: vertical `5099:18`, `5099:33`, `5099:48`, `5099:63`, `5099:80`; horizontal `5099:95`, `5099:110`, `5099:125`, `5099:140`, `5099:157`. |

`arrastando` is the dragging state. A horizontal group (panels side by side) uses the vertical handle; a vertical group (panels stacked) uses the horizontal handle. More than 3 panels: nest groups (the panel of a group receives another group, in the other direction).

## Tokens

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `resizable/handle-color` | `color/border` | `core/neutral/200` | `core/surface/400` | Handle line at rest and disabled |
| `resizable/handle-color-hover` | `color/border-strong` (new) | `core/neutral/600` | `core/surface/200` | Handle line in hover and dragging |
| `resizable/handle-width` | `border/width` | 1 | 1 | Thickness of the line (width on the vertical handle, height on the horizontal) |
| `resizable/focus-border-width` | `core/focus-width/sm` | 2 | 2 | Thickness of the line in focus, which becomes the focus border |
| `resizable/grip-foreground` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Grip icon at rest, hover, focus and disabled |
| `resizable/grip-foreground-active` | `color/accent-foreground` | `core/neutral/950` | `core/neutral/100` | Grip icon while dragging |
| `resizable/grip-background-active` | `color/accent` | `core/surface/50` | `core/surface/600` | Grip box background while dragging (no background in the other states) |
| `resizable/grip-radius` | `radius/subtle` | 2 | 2 | Corner of the grip box |
| `resizable/grip-size` | `icon/size-sm` | 16 | 16 | Side of the grip box and of the grip icon |
| `resizable/handle-gap` | `space/inline-tight` | 4 | 4 | Gap of the line around the grip box and the collapse button |

### Used directly (decided, item 3)

- `focus/border`: color of the focus border of the handle line.
- `state/disabled-opacity`: opacity of the whole disabled handle (50 in Figma, 0.5 in CSS).
- The collapse button is the nph-button icon-only (the nph-icon-button of Figma) `secondary`, `ghost`, `compact`, square, with its own tokens (`control/height-compact`, `radius/control`, focus and colors of that piece).
- The panel padding is `space/container-padding`, and the panel has no background of its own (it inherits the surface where the group lives).

## Anatomy, read part by part in Figma

No layer of the handle has text, so there is no text style.

**Vertical handle** (28 × 200 in Figma; vertical auto layout, items centered on both axes; gap `resizable/handle-gap`). Order from start to end: line segment, grip box, collapse button, line segment.

| Part | Default | Hover | Dragging (`arrastando`) | Focus (`foco`) | Disabled |
|---|---|---|---|---|---|
| Line segment (start and end) | 1 px wide (`resizable/handle-width`), fill `resizable/handle-color` | fill `resizable/handle-color-hover` | fill `resizable/handle-color-hover` | becomes the focus border: 2 px (`resizable/focus-border-width`), fill `focus/border`, no halo | as default |
| Grip box | `resizable/grip-size` square, corner `resizable/grip-radius`, no background | as default | background `resizable/grip-background-active` | as default | as default |
| Grip icon | nph-icon `grip-vertical`, style `light`, `resizable/grip-size`, color `resizable/grip-foreground` | same | color `resizable/grip-foreground-active` | same as default | same as default |
| Collapse button | nph-button icon-only `secondary` `ghost` `compact`, square, 28 × 28, nph-icon `chevron-left` `light` (it points to the start panel, which collapses) | same | same | same (its own focus only when it has focus) | disabled with the handle |
| Whole handle | — | — | — | — | `state/disabled-opacity` |

**Horizontal handle** (200 × 28): the same with the axis swapped. The line segments are bound by height (`resizable/handle-width`; `resizable/focus-border-width` in focus). The collapse button uses nph-icon `chevron-up` `light` (it points to the top panel, which collapses). The grip icon is the same `grip-vertical` rotated 90 degrees (item 4), as the shadcn handle does (`rotate-90`). When nph-icon gets the dotted `grip` of Font Awesome, it replaces the rotated icon; that is not part of this task.

In Figma the line segments have a fixed length; in code the handle fills the cross size of the group (the whole height of a horizontal group, the whole width of a vertical one), with the two segments filling the space before and after the grip box and the button.

**Order and alignment.** The group is a row (horizontal) or a column (vertical), aligned to the start on both axes. Each panel fills the space left on the group axis (grow 1) and the whole cross size, with its content aligned to the top. In the handle, the parts are centered on both axes, in this order: line segment, grip box, collapse button, line segment.

**Main panel of a handle.** Each handle controls the panel at its start: the left panel on a vertical handle, the top panel on a horizontal one. Figma draws it so: the chevron of every handle, in the 2 and 3 panel variants, points to the start (`chevron-left`, `chevron-up`), and the collapsed example collapses the left panel, with the chevron flipped to `chevron-right`. With 3 panels, the first handle controls the first panel and the second handle controls the second panel. This is the main panel of the APG: `aria-controls`, `aria-valuenow`, Enter, Home and End refer to it.

The focus variants keep a hidden layer named `halo de foco` (bound to `focus/halo` and `focus/ring-width`) on purpose: the accepted focus has no halo, and that layer does not go to code.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The grip, in `resizable/grip-foreground`, passes 3:1 over `color/background`, `color/card` and `color/muted`, in both themes, in every brand (6.69:1 over the page and 5.76:1 over `color/muted` in light; 9.81:1 and 6.61:1 in dark). The line at rest, in `resizable/handle-color`, does not reach 3:1 in light (1.69:1): that is why the grip shows in every state, and it is the grip that tells the handle can be dragged. In hover and dragging, the line in `resizable/handle-color-hover` passes 3:1 in both themes. While dragging, the grip icon passes 3:1 over the box in `resizable/grip-background-active`. The disabled handle is exempt. |
| Visible focus | In focus, the handle line becomes the focus border, in `focus/border`. It is 2 px (`resizable/focus-border-width`) and has no halo. The border passes 3:1 over `color/background` and `color/card`, in both themes, in every brand (lowest 4.32:1, light, `Comercial`). The corner is square on the handle, because the focus is the line itself; on the collapse button it is rounded, because it is the focus of the nph-button. The focus border never sits over `color/accent`. The border shows only by keyboard (`:focus-visible`). |
| Color is not the only signal | Dragging: besides the colored grip box, the resize cursor and the panel changing size. Hover: the resize cursor comes with the stronger line. Focus: the line grows to 2 px in the focus color. Disabled: the whole handle in `state/disabled-opacity` and the default cursor. |
| Target size | The grip box side is `resizable/grip-size`. The drag area is invisible and lives in code: at least 24 px, larger on touch, by WCAG 2.5.8 (item 5), as the `resizeTargetMinimumSize` option of react-resizable-panels. Figma keeps the thin line. The collapse button is `control/height-compact` (28), above the 24 × 24 minimum; compact outside a dense screen is an exception recorded in T4 for this handle (item 6), because the handle is thin and the component is desktop only. |
| Alternative to dragging | The collapse button collapses and restores the panel; a double click on the handle restores the default size. Neither reaches a chosen size: when the handle is the only way to resize, the product offers a one-tap way out, such as sizes in a menu, a size field or step buttons (WCAG 2.5.7; item 9). |
| Accessible name | The handle has role `separator` and receives focus, with `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-controls` on the main panel; its accessible name is the name of the panel it controls. The collapse button has an `aria-label` with the action and the panel. The grip icon is `aria-hidden`. |
| Keyboard | WAI-ARIA APG Window Splitter: the arrows move the handle on its axis; Shift with an arrow takes a bigger step; Enter collapses and restores; Home and End, optional, take it to the minimum and the maximum; F6, optional, moves to the next panel. In the Tab order, the handle and the collapse button are separate stops, each with its own focus. |

## Properties, variants and states

| Field | Rule |
|---|---|
| `direcao` (direction) | On the group. `horizontal`, the default: panels side by side, with the vertical handle. `vertical`: panels stacked, with the horizontal handle. |
| `paineis` (panels) | On the group. `2`, the default, or `3`. For more panels, nest groups. |
| `orientacao` (orientation) | On the handle. `vertical`, the default, or `horizontal`. It follows the direction of the group. |
| `state` | On the handle. `default`; `hover`, with the line in `resizable/handle-color-hover`; `arrastando` (dragging), with the line as in hover and the grip box with a background; `foco` (focus), with the line as the 2 px focus border, no halo; `disabled`, with the whole handle in `state/disabled-opacity`. |
| `botão recolher` (collapse button) | On the handle. Boolean, on by default (item 9). Off, the handle shows the line and the grip. The chevron points to the side of the panel that collapses and flips when the panel is collapsed; it is swapped by the icon of the button instance. |
| Not a property | The size of each panel, minimum and maximum, default size, collapsed size, persistence and a whole disabled group belong to code and to the product (each one is an open point in DSA-86). The collapsed panel shows in the examples, with no variant of its own (item 7). The handle has one size. |

## Relations and context

- The panel has no background of its own: it inherits the surface where the group lives, `color/background` or `color/card`. The group has no outer outline.
- The collapse button is the nph-button icon-only: the icon color (`color/secondary-foreground`), the focus and the corners come from it. The grip is the nph-icon. The panel content is free; in the examples it is nph-skeleton.
- Between the line, the grip box and the button, the gap is `resizable/handle-gap`. The panel padding is `space/container-padding`. Groups nest in the opposite direction.

## When to use

- Horizontal for contents side by side, such as list and reading pane or editor and preview; vertical for content over detail, such as editor and console.
- Three panels when there is navigation, list and reading pane on the same screen. For more, nest groups.
- Keep the collapse button on when a panel can get out of the way. Turn it off only when the screen already offers another one-tap way to resize.
- To show or hide a side area without resizing, use the nph-sidebar.

## Required examples (in Figma, light and dark)

List and reading pane (horizontal, 2 panels); nested (the right panel split vertically); collapsed (the left panel collapsed; the button restores it).

## Do

- Keep the grip in view in every state: it shows that the handle can be dragged, because the line at rest does not reach 3:1 in light.
- Keep the panel without a background and the group without an outline.
- Give each panel a minimum and a maximum from the width of its content: the handle stops there and the content does not break.
- Store the chosen size and restore it on return.
- Offer a one-tap way out when the handle is the only way to resize: dragging cannot be the only path.

## Do not

- Do not hide the grip and leave the line alone.
- Do not put an outline around the group.
- Do not give the panel a background of its own.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG Window Splitter pattern. The Nephos adds Shift + arrow, the double click and the collapse button; the rest follows the pattern.

| Key or action | What it does |
|---|---|
| Arrow on the handle axis | Vertical handle: left and right; horizontal handle: up and down. Moves the handle one step and changes the size of the two neighbor panels. The arrows of the other axis do nothing. |
| Shift + arrow | Moves the handle a bigger step. |
| Enter | Collapses the main panel; again, restores the previous size (APG). |
| Home and End (optional) | Take the main panel to the minimum and the maximum (APG). |
| F6 (optional) | Moves focus to the next panel (APG). |
| Tab | The handle and the collapse button are separate stops, in document order. The button sits beside the separator element, not inside it: in ARIA 1.2 the children of a `separator` are presentational (https://www.w3.org/TR/wai-aria-1.2/#separator). The disabled handle leaves the Tab order (see "Combined states"). |
| Collapse button | Click, Enter or Space collapse and restore the panel; focus stays on the button, and the chevron flips. |
| Focus on open and close | Does not apply: the group does not open or close. On collapse and restore, focus stays on the piece used, the handle or the button. |
| Esc and click outside | Do not apply: nothing opens over the page. |
| Pointer × focus | Hover only paints the line and shows the resize cursor; it does not move focus. On pointer down, the handle receives focus, and the focus border shows only by keyboard (`:focus-visible`). |
| Double click on the handle | Restores the default size (alternative to dragging). |
| Window edge | Does not apply: nothing floats. The handle stops at the minimum and the maximum of each panel. |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. |

## Combined states (T11)

T11 (same rule for every component): 1. selected or checked + disabled keeps the selected background and mark under `state/disabled-opacity`; 2. error + disabled: disabled wins and only the opacity stays. Neither applies to the handle, which has no selection and no error. Disabled + hover, dragging or focus: disabled wins; the handle does not answer the pointer nor the keyboard, stays in `state/disabled-opacity` with the default cursor and leaves the Tab order, as a standalone disabled control in the APG. The collapse button is part of the handle and is disabled with it.

## Icon and image

- Grip: nph-icon `grip-vertical`, style `light` in every state (dragging changes only the color), 16 px in `resizable/grip-size`; on the horizontal handle, rotated 90 degrees (item 4).
- Collapse button: nph-icon `chevron-left` on the vertical handle and `chevron-up` on the horizontal one, style `light`, 16 px (`icon/size-sm`), inside the nph-button icon-only compact, in `color/secondary-foreground`; the chevron points to the start panel, which collapses, and flips (`chevron-right`, `chevron-down`) while that panel is collapsed.
- Image: the component has none; the panel content is free.
- Sources: https://fontawesome.com/icons/grip-vertical?s=light ; https://fontawesome.com/icons/chevron-left?s=light

## Limits (the six cases)

- Minimum: the handle stops at the minimum of each panel, given by the width of the content; Home takes it there; the value belongs to code and the product.
- Maximum: the same as the minimum, with End.
- Long text: does not apply to the handle, which has no text; the panel content is free and does not break, because the minimum follows its width.
- Empty: does not apply to the component; the panel content is free.
- Many items: more than 3 panels by nesting groups.
- Short window: out of mobile in v1; below the tablet breakpoint the panels stack or become tabs (item 8). Who swaps the layout is an open point for the code (DSA-86, "Open points for the code").

## Inherited decisions

- From the accepted proposals (root `5112:1850`): 1 A, grip with no outlined box; 2 A, neutral line in hover and dragging; 3 A, collapse button on by default; 4 A, group with no outline.
- From the decision record: T9, tokens in three layers (table above); T4, item 2, compact only in a dense context, now with the exception of the collapse button of this handle (item 6); T11, combined states (above).
- From the decision map, line 188: "adia", changed to "entra" with this task (a finished component enters v1, rule of 06-11).
- From the adjustment of 14-11, accepted with the green light of 16-11: handle focus as a 2 px line in `focus/border`, no halo.
- From the visual style of the design owner: 1 px outline in the soft tone, 2 px only in selection and focus, separate by space.

## Decisions answered (approval round of 16-11, all as recommended)

1. Documentation `5123:2641` and appendix accepted.
2. `color/border-strong` created, with the description "Divider and outline of an area in interaction: the line of the nph-resizable handle in hover and dragging. Passes 3:1 over `color/background` and `color/card`. DO NOT USE at rest — there it is `color/border`. DO NOT USE on a field border — there it is `color/input`." The matching DO NOT USE in `color/border` and `color/input` names the nph-resizable handle line, so the accepted hover line of the underline nph-tabs and hover border of the nph-file-upload-item keep their tokens. `resizable/handle-color-hover` points to it.
3. `resizable/focus-border-width` → `core/focus-width/sm`; the focus color and the disabled opacity go straight, with no component token.
4. Grip rotated 90 degrees on the horizontal handle now; later, the dotted `grip` of Font Awesome in nph-icon (not `grip-lines`).
5. Invisible hit area of at least 24 px in code (larger on touch); in Figma the thin line stays.
6. Exception to T4: the collapse button of the handle in compact (28 px).
7. Collapsed as an example only, with no variant.
8. Out of mobile in v1 (below the tablet breakpoint, the panels stack or become tabs).
9. Collapse button on by default; the documentation tells the product to give a one-tap way out when the handle is the only way to resize.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1626:34`: documentation `5123:2641`, root `5112:1850`, group set `5112:1849`, handle set `5099:172`
- WAI-ARIA APG, Window Splitter: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- WAI-ARIA 1.2, separator: https://www.w3.org/TR/wai-aria-1.2/#separator
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, dragging movements: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- react-resizable-panels: https://github.com/bvaughn/react-resizable-panels
- shadcn resizable: https://ui.shadcn.com/docs/components/resizable
- Ant Design Splitter: https://ant.design/components/splitter
