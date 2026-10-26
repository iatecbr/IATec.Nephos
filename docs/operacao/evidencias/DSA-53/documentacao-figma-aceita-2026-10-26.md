```json
{
  "task": "DSA-53",
  "gate": "figma-docs-accepted",
  "date": "2026-10-26",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1366-2",
    "date": "2026-10-26",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-sidebar-item board, with its Documentação frame (2723:460), was accepted as the API and behavior specification of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button. COMPONENT_SET: nph-sidebar-item (2251:51271), nph-sidebar-subitem (2251:51312), nph-sidebar-rail-button (2251:51328). The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  }
}
```

# DSA-53 — `figma-docs-accepted`

The documentation of the `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-rail-button` (frame `2723:460`) was accepted in Figma, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The pieces needed `sidebar/*` tokens and focus radii, which were put on `v/5.0.0` together with this task, with the core primitives they point to. Every other token they use was already there.

There is no command output. The acceptance is a human observation, recorded in the json block above with the board URL and the components.

The rest of this file is the Figma documentation converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (Portuguese); the code API is in English.

## Purpose

Leads the person to a page or opens a group of pages, in a line of the lateral menu. Comes as first-level item, second-level subitem, and rail button, which plays the role of the item when the menu is collapsed.

Selection: nph-sidebar-item — type (link, counter, group-closed, group-open); state; optional parts (more actions, tooltip). nph-sidebar-subitem — options (no, yes); state; tooltip. nph-sidebar-rail-button — state; counter; tooltip.

## Description

Use inside nph-sidebar to navigate between product areas. The item is the first-level line; the subitem is the second-level line, inside a group; the rail button shows only the icon when the menu is collapsed. Does not replace nph-panel-menu, which organizes navigation inside content, nor nph-dropdown-menu, which opens actions and choices.

## Anatomy

Item in focus with more actions and tooltip (parts 1, 2, 3, 5, 6, 8) and group in hover (parts 4, 7).

| Part | Rule |
|---|---|
| 1. Icon | nph-icon in icon/size-md, in the color of the label. When active or in group open, switches to solid style. |
| 2. Label | Text of one line in text/body-md. When active or in group open, changes to text/label-md. If it does not fit, ends in ellipsis. |
| 3. Counter | Optional. Pill with the number in text/label-sm, in sidebar/item-badge-background and sidebar/item-badge-foreground. Only in counter type and in the rail button. |
| 4. Arrow | Only in groups and in subitem with options, in icon/size-sm: down in group closed, up in group open, right in subitem with options. |
| 5. More actions | Optional. nph-icon-button ghost, compact, with ellipsis-vertical icon, to the right, in hover and focus. |
| 6. Tooltip | Optional. nph-tooltip with the full name, in hover and focus. |
| 7. Background | In sidebar/item-background-hover on hover. In rest and active there is no background: active is marked by the color sidebar/item-foreground-active and by the solid icon. In the rail button, the background is sidebar/rail-background-hover on hover and sidebar/rail-background-active when active, with the icon in sidebar/rail-foreground-active. When active, the counter gains outline sidebar/panel-background. |
| 8. Focus ring | Border color/primary and halo focus/halo around the line, with radii focus/border-radius-sidebar-item and focus/radius-sidebar-item. On the rail button, focus/border-radius-container and focus/radius-container. |

Demonstrations in the frame: first-level item, second-level subitem, rail button.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Label, number and icon pass 4.5:1 and 3:1 against the line background (sidebar/panel-background at rest and focus, sidebar/item-background-hover on item and subitem hover, sidebar/rail-background-hover on rail button hover), and the number against sidebar/item-badge-background, in both modes. On the rail button, the icon passes 3:1 against sidebar/rail-background-hover on hover and against sidebar/rail-background-active when active. Disabled is exempt. |
| Visible focus | Focus draws a border color/primary and halo focus/halo around the whole line, in the same pattern as nph-button. Border passes 3:1 against sidebar/panel-background. |
| Color is not the only signal | Active also switches the icon to solid and the label to text/label-md. Open group shows the arrow up. Counter brings the number as text. On the rail button, active also gains the background sidebar/rail-background-active. |
| Touch target | The whole line is the target: sidebar/item-height on item, control/height-default on subitem, sidebar/rail-button-size on rail button. The more actions button is small and only serves mouse and keyboard; on touch, the same actions are on the destination page. |
| Accessible name | Name comes from the label. On the rail button, without visible label, name comes from aria-label and tooltip repeats the name. Icon is decorative (aria-hidden) and counter number is read as text. In groups, the arrow is visual only: open or closed state is announced (aria-expanded). More actions button has its own aria-label. |

Demonstrations in the frame, in light and dark: focus with border and halo; active with solid icon and text/label-md; rail button in focus with tooltip.

## Properties, variants and states

| Figma property | Rule |
|---|---|
| type | link leads to a page. counter is a link with the number of pending items. group-closed and group-open open and close subitems. Only nph-sidebar-item has type. |
| state | rest, hover, active, focus, disabled. Active marks the current page and does not exist in groups. Disabled uses state/disabled-opacity. |
| label | Text of the line, one line only. If it does not fit, ends in ellipsis. |
| icon and icon solid | Switch the icon of the piece. Solid appears when active and in group open; light in other cases. |
| counter | Number text, in counter type. On the rail button, counter is a linked or unlinked property and the number is another field. |
| more actions | Turns on the ellipsis-vertical button on hover and focus. Comes off. Mouse and keyboard only. |
| tooltip | Turns on nph-tooltip with the full name on hover and focus. Comes off on item and subitem, on on the rail button. Tooltip text does not follow the label: whoever uses it edits both. |
| options | On nph-sidebar-subitem: yes shows the arrow to the right, indicating a list of options; no leaves the subitem with label only. |
| destination, open, close | Not Figma properties. Link destination, current page and group opening come from code. In Figma, choose type and state. |
| expanded or collapsed mode | Not a piece property: nph-sidebar switches the item for the rail button. |

Defaults of the set: type=link, state=rest, counter off, more actions off, tooltip off (on on rail button), options=no.

Demonstrations in the frame, in light and dark: type link, counter, group-closed and group-open; options no and yes on subitem; rail button with counter on.

## Usage

The component has no code yet; the attributes come with the spec. The frame shows only the tag, `<nph-sidebar-item></nph-sidebar-item>`, and the import, `import 'nephos/nph-sidebar-item';`.

## Relations and context

- Lives inside nph-sidebar, which decides expanded or collapsed mode, width, and the switch of item for rail button. Item fills the width it receives.
- Group opens subitems right below it. Subitem with right arrow indicates a list of options.
- Tooltip is nph-tooltip and counter uses the primary palette. Each piece keeps its own state and focus.
- Space: space/control-padding between icon and label; sidebar/item-padding padding around. On subitem: space/inline between label and arrow and top and bottom; sidebar/item-padding on sides.

Demonstration in the frame, in light and dark: group open with subitems below; active marks current page; collapsed menu with rail button; tooltip with full name.

## When to use

- Link: lead to a product page.
- Counter: the page has something to look at, like new messages or tasks.
- Group: gather pages of the same subject under an item that opens and closes.
- Subitem: second level, inside an open group. Use options when the subitem leads to other choices.
- Rail button: collapsed menu, where only icon fits. Turn on tooltip to say the name.
- Tooltip: when the label can be cut, to show the full name.
- More actions: shortcut of item actions for mouse and keyboard users, always with the same actions on the destination page.
- Disabled: the page exists, but the person has no access now.

Demonstrations in the frame, in light and dark: link and counter lead to a page; group with subitem leading to options; disabled has no access now.

## Mandatory examples

Light mode: main menu with current page and counter; group open with subitems; collapsed menu with rail buttons.

Dark mode: main menu with current page and counter; group open with subitems; collapsed menu with rail buttons.

## Do

- Mark the current page with active state — the person sees where they are without reading the whole menu.
- Keep the label short, one line — what goes beyond ends in ellipsis.
- Turn on tooltip when the label can be cut — the full name appears on hover and focus.
- Turn on tooltip on the rail button — without visible label, tooltip says the name.
- Choose an icon that reminds of the page — the person recognizes the item before reading.
- Offer the same actions from more actions also on the destination page — on touch the button does not appear.

Demonstrations in the frame, in light and dark: active state on current page; tooltip on cut label; tooltip on rail button.

## Do not

- Do not use the item as an action button, like save or delete — use nph-button.
- Do not use group for one page only — use type link.
- Do not mark two items as active — only the current page is active.
- Do not leave long label without tooltip — the name gets cut and there is no way to read it; turn on tooltip.
- Do not leave rail button without tooltip — without label, nobody knows what it opens; turn on tooltip.
- Do not rely on more actions as the only path — on touch it does not appear; put actions on the destination page.
- Do not write text in counter — counter shows number only; for a short label, use nph-badge.
- Do not use the item to choose an option or open actions in a menu — use nph-dropdown-menu.
- Do not use subitem outside a group — use nph-sidebar-item.

Demonstrations in the frame, in light and dark: item used as action button; group for one page only; two active items; long label cut without tooltip; rail button without tooltip; more actions as only path; text in counter; item for choosing option; subitem outside group.

## Tokens used

- sidebar/item-foreground (core/surface/700 light, core/surface/100 dark) — label and icon at rest
- sidebar/item-foreground-active (color/primary-hover) — label and icon when active
- sidebar/item-foreground-open (color/primary-hover) — label and icon in group open
- sidebar/item-background-hover (color/primary-surface) — background on hover of item and subitem
- sidebar/item-badge-background (color/primary-hover) — counter background
- sidebar/item-badge-foreground (color/primary-foreground) — counter number
- sidebar/rail-background-hover (color/primary-surface) — rail button background on hover
- sidebar/rail-background-active (color/primary-hover) — rail button background when active
- sidebar/rail-foreground-active (color/primary-surface-hover) — rail button icon when active
- sidebar/panel-background (color/primary-surface-hover) — counter outline when active
- sidebar/item-height (core/space/800) — item height
- sidebar/item-padding (core/space/off-scale/10) — padding around the item; sides of the subitem
- sidebar/item-radius (core/radius/500) — item and subitem radius
- sidebar/rail-button-size (core/space/800) — rail button width and height
- focus/border-radius-sidebar-item (core/radius/off-scale/13) — focus border radius of item and subitem
- focus/radius-sidebar-item (core/radius/off-scale/17) — focus halo radius of item and subitem
- focus/border-radius-container (core/radius/off-scale/9) — focus border radius of the rail button
- focus/radius-container (core/radius/off-scale/13) — focus halo radius of the rail button
- color/primary (theme/brand-600 light, theme/brand-400 dark) — focus border; the pieces do not use focus/border
- border/width — focus border width
- focus/halo (theme/brand-halo light, theme/brand-halo-dark dark) — focus halo
- focus/ring-width — focus halo width
- space/control-padding (core/space/300) — between icon and label
- space/inline (core/space/200) — on the subitem, between label and arrow and top and bottom; sides of the counter
- icon/size-md (core/icon-size/200) — icon; counter height
- icon/size-sm (core/icon-size/100) — arrow
- control/height-default — subitem height
- radius/container (core/radius/400) — rail button radius
- radius/full — counter pill
- state/disabled-opacity — disabled
