```json
{
  "task": "DSA-69",
  "gate": "figma-docs-accepted",
  "date": "2026-11-06",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4838-27591",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-context-menu documentation frame (4838:27591, page 4128:17776), with the Figma UX QA and the textual audit approved, and approved the 11 points of the approval page: documentation acceptance; menu panel radius 12 and item radius 8, straight on core, with the item focus border at 9 and the halo at 13; color/dropdown-border now points to color/border-subtle, the outline of nph-popover; dropdown/separator on color/border-subtle; the new semantic token color/destructive-text (light core/danger/600, dark core/danger/300) for the destructive item; the solid icon on highlight also in nph-dropdown-menu; a compact destructive item; no context-menu/* tokens, the context menu uses the dropdown/* tokens; the arrow-pointer icon in nph-icon; the cleanup of the old frames; notification/error-action-foreground stays as it is. A finished component enters the first version. COMPONENT_SET nph-context-menu (4819:15828), submenu x size x focus, 12 variants."
  }
}
```

# DSA-69 — `figma-docs-accepted`

The documentation of `nph-context-menu` (frame `4838:27591`) was accepted in Figma on 2026-11-06, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The context menu enters the first version of Nephos. It has no tokens of its own: the panel, the items, the group label and the separator are the pieces of nph-dropdown-menu, and the corrections approved for the context menu change those shared pieces. Eight `dropdown/*` tokens came with this task and are on `v/5.0.0`, plus:

- one new semantic token: `color/destructive-text` (light `core/danger/600` #b01e1e, dark `core/danger/300` #ea7d7d), the text and icon of a destructive action over a neutral surface. It measures 4.69:1 over `color/popover` in dark, where `color/destructive-on-surface` (#f8d4d4) almost turned white;
- a new target for `color/dropdown-border`: `color/border-subtle` in both modes (#f1f1f1 in light, white at 10% in dark), the outline of nph-popover. It also changes the outline of the nph-navigation-menu panel and of the loading nph-notification, which use `color/dropdown-border`; the `elevation/dropdown` shadow completes the separation from the background.

Four `dropdown/*` tokens point straight to core, by decision: `dropdown/panel-radius` (`core/radius/500`, 12), because `radius/container`, the container with a medium corner, resolves to 8 and its description now leaves the menus out, and no semantic token resolves to 12; `dropdown/item-radius` (`core/radius/400`, 8), because `radius/inner`, the role of a nested piece, resolves to 4, and the other tokens of 8 (`focus/radius-inner`, `avatar/radius-md`, `image/radius-lg`) belong to other pieces; `dropdown/item-focus-border-radius` (`core/radius/off-scale/9`) and `dropdown/item-focus-halo-radius` (`core/radius/off-scale/13`), the focus ring that follows the item at 8, because the semantic tokens of 9 and 13 belong to the focus of a piece with `radius/container` or `radius/inner` and to the nph-sidebar item. No new core value. The other four `dropdown/*` tokens are aliases of a semantic token of the same role.

The descriptions of `radius/container`, `radius/surface`, `radius/overlay`, `radius/inner`, `focus/border-radius-inner`, `color/border-subtle`, `color/dropdown-border` and `color/destructive` were rewritten in Figma and in `design.md` so that the menus use their own radius and the destructive text has its own token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`submenu`, `fechado`, `aberto à direita`, `aberto à esquerda`, `tamanho`, `padrão`, `compacto`, `foco`, `nenhum`, `1º item`); the code API is in English. Figma sample texts are translated here.

## Purpose

Shows the actions of the object under the pointer (a file, a table row, a card) in a panel that opens at the point of the right click. It varies by submenu (closed, open to the right or to the left), by size and by focus. The items are the items of nph-dropdown-menu.

Use it as a shortcut to the actions of an object the person is already looking at. The menu complements the visible path and never replaces it: whoever does not use the right button needs to find the same action on the screen. It does not replace nph-dropdown-menu, which opens from a visible button, nor a toolbar, which keeps the actions always in view.

## Tokens

The context menu has no `context-menu/*` token. It uses the tokens of nph-dropdown-menu.

| Token | Points to | Part |
|---|---|---|
| `color/popover` | — | Panel fill |
| `color/dropdown-border` | `color/border-subtle` | Panel outline, 1 px (`border/width`) |
| `dropdown/panel-radius` | `core/radius/500` (12) | Panel and submenu corners |
| `space/inline-tight` | — | Panel inner margin, 4 on every side |
| `layout/input-width` | — | Panel width, as nph-dropdown-menu |
| `dropdown/item-radius` | `core/radius/400` (8) | Item corners |
| `space/inline` | — | Item inner margin and gap |
| `dropdown/separator` | `color/border-subtle` | Line of the divider between groups |
| `dropdown/item-destructive-foreground` | `color/destructive-text` | Label, shortcut and icon of the destructive item at rest, in focus and disabled |
| `dropdown/item-destructive-hover-foreground` | `color/destructive-on-surface` | Label, shortcut and icon of the destructive item in hover |
| `dropdown/item-destructive-hover-background` | `color/destructive-surface` | Background of the destructive item in hover |
| `dropdown/item-hover-icon-foreground` | `color/primary` | Start icon and submenu arrow of the item in hover |
| `dropdown/item-focus-border-radius` | `core/radius/off-scale/9` | Item focus border, 1 px in `color/primary` |
| `dropdown/item-focus-halo-radius` | `core/radius/off-scale/13` | Item focus halo, `focus/ring-width` in `focus/halo` |

The shadow is the `elevation/dropdown` style. Item label `text/body-md` in `color/popover-foreground`; icon, shortcut and group label in `color/muted-foreground`; shortcut in `text/caption`; hover background `color/primary-surface`, hover label `color/accent-foreground`; single selection in `color/primary-hover` with `text/label-md`; disabled `state/disabled-opacity`. Start icon `icon/size-md`, submenu arrow `icon/size-sm`. Motion: `motion/enter-*`, `motion/exit-*` and `motion/hover-delay`, with no new token.

## Anatomy

1. **Panel** — floating surface in `color/popover`, outline `color/dropdown-border`, corners `dropdown/panel-radius` (12) and the `elevation/dropdown` shadow; it opens at the point of the click.
2. **Item** — the nph-dropdown-menu item: an optional start icon from nph-icon and the label. The icon is light at rest and turns solid on highlight: hover, focus and the item whose submenu is open.
3. **Shortcut** — optional text at the right of the item, in `color/muted-foreground`.
4. **Item with submenu** — shows the `chevron-right` arrow of nph-icon and carries no shortcut.
5. **Separator** — the nph-dropdown-menu separator, between groups of actions: a light line in `dropdown/separator`, #f1f1f1 in light and white at 10% in dark.
6. **Destructive item** — an item with the destructive type, last, after a separator. Label, shortcut and icon in red, `dropdown/item-destructive-foreground`: #b01e1e in light and #ea7d7d in dark.
7. **Submenu** — a second panel equal to the first, with its first item on the same line as the item that opened it.
8. **Group label** (optional) — the nph-dropdown-menu group label, at the top of a group.

## Properties

| Figma property | Rule |
|---|---|
| `submenu` | `fechado` (closed), `aberto à direita` (open to the right) or `aberto à esquerda` (open to the left). The submenu opens to the right; to the left only when there is no room to the right on the screen. |
| `tamanho` (size) | `padrão` (default) or `compacto` (compact). Compact on dense screens, such as tables; every item of the menu in the same size. The compact size also takes the destructive item, with the color change only. |
| `foco` (focus) | `nenhum` (none) or `1º item` (first item). The first item shows the menu opened by keyboard; in code, the focus follows the keys. |

Not properties:
- **Item**: type, selection, size and state come from the nph-dropdown-menu item: default, hover, focus, disabled, destructive, multiple selection and single selection. On highlight (hover, focus and open submenu) the icon turns solid; at rest and disabled it stays light.
- **Position**: the panel opens with its top left corner at the point of the click and changes side when there is no room.
- **Colors and sizes**: they come from the nph-dropdown-menu tokens above.

## Behavior

- Opens with the right click, Shift+F10 or the Menu key; on touch, with a long press of about 700 ms.
- Arrow keys move the focus; Home and End go to the first and the last item; the right arrow opens the submenu and the left arrow closes it; Enter and Space activate the item; typing a letter moves to the next item that starts with it; Esc closes the menu.
- When opened by keyboard, the focus goes to the first item; when closed, it goes back to the object that opened the menu.
- The panel and the submenu change side on collision with the edge of the screen.
- A click outside the menu or a scroll of the page closes it.
- Up to about 12 items, in short groups, with the destructive item last. An action the person can never perform (permission) is hidden; an action unavailable now is disabled.
- In a table (nph-data-table) and in a list, it opens over the clicked row and acts only on it.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The label uses `color/popover-foreground` over `color/popover`; the icon, the shortcut and the group label use `color/muted-foreground`. The label, shortcut and icon of the destructive item without background use `dropdown/item-destructive-foreground`, at least 4.69:1 over the panel, also in focus; in hover, `dropdown/item-destructive-hover-foreground` over `dropdown/item-destructive-hover-background`. The focus border, in `color/primary`, passes 3:1 against `color/popover` in both themes. The separator is decorative and needs no 3:1: groups read by spacing and labels. |
| Visible focus | The item in focus shows the `color/primary` border and the `focus/halo` halo. The border carries the focus; the halo only reinforces it. |
| Color is not the only signal | The item with a submenu has the arrow; open, it keeps the hover background, with the icon and the arrow solid. In hover and focus the icon turns from light to solid, but the hover signal is the background and the focus signal is the border. Multiple selection shows the nph-checkbox box and single selection shows the check. The destructive item says the action in its label, such as Delete, besides the color. |
| Touch target | The item passes the minimum target of 24 x 24 px in both sizes and takes the width of the panel. |
| Accessible name | The panel is a menu (`role="menu"`) and each item a `menuitem`, with the label as name. Multiple selection is `menuitemcheckbox` and single selection `menuitemradio`, with `aria-checked`. The item with a submenu takes `aria-haspopup` and `aria-expanded`. The icon and the arrow are decorative (`aria-hidden`); the shortcut goes in `aria-keyshortcuts`. |

## Usage

Put the tag on the screen, bound to the object that takes the right click, and import the piece: `<nph-context-menu></nph-context-menu>`, `import 'nephos/nph-context-menu';`.

## Relations and context

- Items, group label and separator are the pieces of nph-dropdown-menu: color, state and focus come from the item; the context menu positions the panel.
- It uses nph-icon for the start icon (light at rest, solid on highlight), the submenu arrow and the check of single selection; multiple selection uses nph-checkbox inside the item.
- The shortcut is text at the right of the item, in `text/caption`.
- The panel follows the surface of the floating menus: `color/popover`, outline `color/dropdown-border`, corners `dropdown/panel-radius` and the `elevation/dropdown` shadow.
- Spacing: `space/inline-tight` at the inner edge of the panel; `space/inline` inside the item.

## When to use

- For frequent actions on an object the person is already looking at, such as a file, a table row or a card.
- For few actions in short groups, with the destructive item last; for many actions, use a screen or a dialog.
- The default size on most screens; the compact size on dense screens, such as tables.
- A submenu of one level only, for actions that unfold, such as Share.

## Required examples

In light and dark:

1. Closed menu: actions with shortcuts (Back, Reload, Copy link, Edit), an item with a submenu (Share) and the destructive item last (Delete).
2. Submenu open to the right, on the same line as the item that opened it (Copy link, Download file, More options).
3. Submenu open to the left, when there is no room to the right; compact size.

## Do

- Repeat in the menu actions that also have a visible path on the screen — whoever does not use the right button needs to find the action.
- Put the destructive item last, after a separator — it avoids a click by mistake.
- Show the shortcut when the action has a key — the menu teaches the shortcut.
- Open the submenu on the side that has room — the panel cannot leave the screen.

## Do not

- Do not put the destructive item among the other actions — leave it last, after a separator.
- Do not put a shortcut on an item with a submenu — the arrow already takes the right side of the item.
- Do not mix the default and compact sizes in the same menu — use one size only.

## Changes to nph-dropdown-menu (accepted in Figma together)

The context menu and nph-dropdown-menu share the item, the separator and the panel, so these changes land in nph-dropdown-menu too:

1. Panel radius 12 (`dropdown/panel-radius`) and item radius 8 (`dropdown/item-radius`); the item focus border at 9 (`dropdown/item-focus-border-radius`) and the halo at 13 (`dropdown/item-focus-halo-radius`). Before: `radius/container`, `radius/inner`, `focus/border-radius-inner` and `focus/radius-inner-with-border`.
2. Outline: `color/dropdown-border` now resolves to `color/border-subtle`; nothing changes in the component CSS.
3. Separator line in `dropdown/separator`. Before: `color/border`.
4. Destructive item: `dropdown/item-destructive-foreground` at rest, in focus and disabled; `dropdown/item-destructive-hover-foreground` and `dropdown/item-destructive-hover-background` in hover. Before: `color/destructive-on-surface` and `color/destructive-surface`. Light does not change; in dark the text goes from #f8d4d4 to #ea7d7d.
5. Start icon solid on highlight: hover, focus and open submenu, in every type, selection and size; back to light at rest and disabled. The color of each state does not change (focus keeps `color/muted-foreground`; the destructive item keeps its red).
6. A compact destructive item (`tipo=destructive`, `tamanho=compacto`) in the four states, with the color change only.

In Figma: item set `1365:57` (new compact destructive variants `5005:201529`, `5005:201548`, `5005:201567`, `5005:201586`), separator `1365:60`, panel `1365:63`.

## Change to nph-icon

The `arrow-pointer` icon from Font Awesome enters nph-icon, light and solid (`5005:20391` and `5005:20395` in set `248:143`), for the example of the menu opening at the point of the click.

## Appendix points answered

Points 5, 8, 13, 14, 15, 16, 17 and 18 were items of the approval page. The other points carried a recommendation in the appendix, and the approval page said they follow it; Indiane approved the whole page.

1. Scope: the context menu enters the first version now (a finished component enters the first version).
2. Own component or a usage rule of nph-dropdown-menu: in Figma, its own set made only of nph-dropdown-menu pieces; in code, the code owner decides whether it is a directive over the same menu.
3. Panel outline: `color/dropdown-border`, as nph-dropdown-menu.
4. Panel: its own frame bound to the same tokens as the nph-dropdown-menu panel, because that instance has fixed items.
5. Tokens: no `context-menu/*`; the context menu uses the `dropdown/*` tokens.
6. Width: the same as nph-dropdown-menu (`layout/input-width`); no token of its own now.
7. Unavailable action: hide what the person can never do (permission), disable what is unavailable now.
8. Cursor of the opening example: `arrow-pointer`, light, in nph-icon.
9. Behavior and accessibility: the APG menu pattern, as in Behavior and Accessibility above.
10. Single selection with a check, not with nph-radio, and `menuitemradio` in code.
11. Vertical inner margin on an inline semantic token: the same as nph-dropdown-menu now.
12. Destructive item almost white in dark: closed by point 15.
13. Compact destructive item: added to the nph-dropdown-menu item.
14. Solid icon on highlight in nph-dropdown-menu too.
15. Destructive text: `color/destructive-text`, new semantic token.
16. Separator: `dropdown/separator` on `color/border-subtle`, shared by both menus.
17. Radius 12 and 8, and the outline on `color/border-subtle`.
18. Old frames: they leave Figma in the cleanup, after this task.

`notification/error-action-foreground` stays on `color/destructive-hover`: the action of the error notice sits on `status/error-surface`, not on a neutral surface.
