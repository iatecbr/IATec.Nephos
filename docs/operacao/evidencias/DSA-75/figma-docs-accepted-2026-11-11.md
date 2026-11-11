```json
{
  "task": "DSA-75",
  "gate": "figma-docs-accepted",
  "date": "2026-11-11",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5876-216753",
    "date": "2026-11-11",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the nph-tree documentation frame (5876:216753, page 1626:35), the appendix (5876:217199), COMPONENT_SET nph-tree item (5485:350), COMPONENT_SET nph-tree group (5485:421) and COMPONENT_SET nph-tree (5485:766), with the Figma UX QA and the textual audit approved, and approved all the points of the approval page: the chevron of the selected item on color/primary-text (tree/toggle-foreground-selected); the icon of the folder and of the file on color/muted-foreground and, when selected, on color/primary-text; the uses outside the description (space/inline-tight between the parts of the row and around the tree, color/primary-border in the bar, color/primary-surface with the text on color/primary-text) with their new descriptions; and pending points 1 to 6 and 8 to 12 of the appendix as recommended (item height 36 on control/height-default, hover on color/accent with color/accent-foreground, focus inside the row in focus/border at 2 px, hover does not move the focus, error row inside the group with Enter to try again, spinner in place of the chevron and skeleton only on the first load, no depth limit, no guide lines, focus wins over hover, indent 24 on core/space/600, the checkbox takes its own hover on color/input-hover). Pending point 7 (Tree Table against the tree of nph-table) stays open and goes to the plan of the Tree Table. The specification, converted to text, is in the rest of this file."
  }
}
```

# DSA-75 — `figma-docs-accepted`

The documentation of `nph-tree` (frame `5876:216753`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The tree enters the first version of Nephos. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New: 25 semantic tokens, `tree/*`. Every layer of the three Figma sets is bound to them; the visual did not change. No semantic token was created outside this family.
- No new value in core (rule T9): every token points to a semantic token of the same function, except three that point straight to a primitive by decision (rule 3), listed below with the reason.
- Straight to core by decision, because no semantic token has their function: `tree/indent` on `core/space/600` (24; the semantic tokens of 24, `layout/gutter`, `layout/margin-default`, `space/overlay-padding` and `icon/size-lg`, belong to another function); `tree/indicator-width` and `tree/focus-border-width` on `core/focus-width/sm` (2; the only semantic token with the same value, `radius/subtle`, is a radius, and `focus/ring-width` is the width of the ring drawn outside, which does not exist here).
- Uses outside the description of a semantic token, declared and approved: `tree/item-gap`, `tree/toggle-padding` and `tree/padding` on `space/inline-tight` (the touch targets of 24 already carry their own inner room, and the tree follows rule T6 for lists; precedents `table/cell-gap-tight` and `navigation-menu/trigger-gap` for the gaps of the row, and `navigation-menu/panel-padding` for the room around the tree); `tree/indicator-background` on `color/primary-border` (the bar is a 2 px stroke, and `color/primary` measures 2.86:1 over `color/primary-surface` in the Gerencial brand in dark; precedent `progress/indicator-background`); `tree/item-background-selected` on `color/primary-surface`, with the label, the chevron and the icon on `color/primary-text` (7.21:1 at least, against 4.64:1 of `color/primary-on-surface` in light; precedent `sidebar/item-background-active`).
- New descriptions approved in the same acceptance (Figma already has them): `space/inline-tight`, `color/primary-border`, `color/primary-surface`, `core/space/600` and `core/focus-width/sm`. In the repository they are in `design.md`, in the `use` of the three semantic tokens; the primitives `core/space/600` and `core/focus-width/sm` keep no description in the repository, only the value.
- Left without a component token: the pieces inside the tree, each with its own tokens (nph-checkbox, nph-icon, nph-spinner, nph-skeleton, nph-empty and nph-tooltip); the typography of the label, from the text styles (`text/body-md`, and `text/label-md` when selected); the movement of the chevron, in `motion/expand-duration` and `motion/expand-easing`. The tree has no shadow style and no halo.
- The `use` of fifteen semantic tokens in `design.md` now names nph-tree where the accepted Figma uses them: `control/height-default`, `space/inline`, `space/inline-tight`, `radius/control`, `color/foreground`, `color/primary-text`, `color/accent`, `color/accent-foreground`, `color/primary-surface`, `state/disabled-opacity`, `color/primary-border`, `color/muted-foreground`, `focus/border`, `status/error` and `icon/size-sm`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks (`tipo`, `galho fechado`, `galho aberto`, `folha`, `estado`, `padrão`, `hover`, `foco`, `selecionado`, `selecionado foco`, `desabilitado`, `selecionado desabilitado`, `carregando`, `checkbox`, `ícone`, `rótulo`, `conteúdo`, `itens`, `erro`, `vazio`, `seleção`, `nenhuma`, `única`, `múltipla`).

## Purpose

Shows items organized in levels, such as folders and files, so the person opens and closes each branch and chooses one item or several.

Use it when the data has two or more levels and the person needs to see where each item is, open the branch that matters and choose one item or several. It does not replace the side menu of the main navigation (nph-sidebar), nor the nph-accordion to show and hide content. With one level of data, use a list or a table. It does not replace the tree inside a table: data with columns goes to the tree of nph-table.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-tree item set (`nph-tree / item`) | `5485:350` | `tipo` (`galho fechado`, `galho aberto`, `folha`) × `estado` (`padrão`, `hover`, `foco`, `selecionado`, `selecionado foco`, `desabilitado`, `selecionado desabilitado`, and `carregando` on the open branch); booleans `checkbox`, `ícone` and `rótulo`. |
| nph-tree group set (`nph-tree / grupo`) | `5485:421` | `conteúdo` (`itens`, `carregando`, `erro`). |
| nph-tree (`nph-tree`) | `5485:766` | `seleção` (`nenhuma`, `única`, `múltipla`) × `conteúdo` (`itens`, `vazio`). |

The item has the nph-icon (chevron, folder, folder-open, file), the nph-checkbox (multiple selection), and, while loading, the nph-spinner. The group has the nph-skeleton rows on the first load and the error row. The empty tree has the nph-empty. The nph-tooltip shows the cut label.

## Tokens

The first value is light and the second is dark; one value means the same in both. All tokens are in one family, `tree/*`, in the semantic collection, and every one has the same alias in light and in dark; the final color still changes by mode, through the token it points to. Three of them point straight to core, by decision (see above).

| Token | Points to | Where it is used, and why |
|---|---|---|
| `tree/item-height` | `control/height-default` | Height of the item (36). The only semantic token with that value ("when in doubt, it is this one"). Precedent: `sidebar/item-height` in the nph-sidebar sub item. |
| `tree/item-padding-inline` | `space/inline` | Side padding of the item. The other semantic tokens with the same value (`space/stack-snug`, `radius/container`, `focus/radius-inner`) are of another function. Precedents: `navigation-menu/item-padding` and the item of nph-dropdown-menu. |
| `tree/item-gap` | `space/inline-tight` | Gap between the chevron target, the checkbox, the icon and the label. Declared deviation from "do not use between independent elements": the targets of 24 already carry their own room. Precedents: `table/cell-gap-tight` and `navigation-menu/trigger-gap`. |
| `tree/item-radius` | `radius/control` | Corner of the item, a piece that is operated. The only semantic token of 6. Precedent: `navigation-menu/trigger-radius`. |
| `tree/indent` | `core/space/600` (24) | Indent of each level (left padding of the group). Straight to core by decision: the semantic tokens of 24 are of another function. The tree of nph-table indents with `table/expand-indent` (`control/height-compact`), also of another function (pending point 11, answered below). |
| `tree/padding` | `space/inline-tight` | Breathing room around the tree. Declared deviation from the description ("a unit only"), supported by rule T6 (lists of options and menus). Precedent: `navigation-menu/panel-padding`. |
| `tree/toggle-icon-size` | `icon/size-sm` | Chevron, and the spinner that replaces it while loading (16). Precedent: `table/icon-size`. |
| `tree/toggle-padding` | `space/inline-tight` | Makes the target of 24 of the chevron, as the target of the nph-checkbox. |
| `tree/icon-size` | `icon/size-sm` | Folder, file and error icon; `icon/size-md` is for the menu item. Precedent: `table/icon-size`. |
| `tree/item-foreground` | `color/foreground` | Label, message and "Try again" of the error row. Precedent: `table/foreground`. |
| `tree/item-foreground-selected` | `color/primary-text` | Label of the selected item (the description of `color/primary-text` is the checked item). Precedent: `sidebar/item-foreground-active`. |
| `tree/item-background-hover` | `color/accent` | Background of the hover ("hover, focused list item"). Follows DSA-29 D5. |
| `tree/item-foreground-hover` | `color/accent-foreground` | Label in hover. Precedent: `navigation-menu/item-title-foreground-hover`. The chevron stays on `color/muted-foreground` in hover outside the selected state, so the hover stays soft. |
| `tree/item-background-selected` | `color/primary-surface` | Background of the selected item. Precedent: `sidebar/item-background-active`. The text goes on `color/primary-text`, not on `color/primary-on-surface` (declared deviation, as in the sidebar). |
| `tree/item-disabled-opacity` | `state/disabled-opacity` | Whole disabled item. Precedents: `tabs/item-disabled-opacity` and `pagination/disabled-opacity`. |
| `tree/indicator-background` | `color/primary-border` | Bar of the selected item. Declared deviation from "do not use in fill": `color/primary` measures 2.86:1 over `color/primary-surface` in the Gerencial brand in dark. Precedent: `progress/indicator-background`. |
| `tree/indicator-width` | `core/focus-width/sm` (2) | Width of the bar. Straight to core by decision: the only semantic token of 2, `radius/subtle`, is a radius. Precedents: `data-table/row-selected-indicator-width`, `tabs/indicator-width` and `navigation-menu/current-indicator-width`. |
| `tree/toggle-foreground` | `color/muted-foreground` | Chevron outside the selected state, in hover too. Precedent: `navigation-menu/item-icon-foreground`. |
| `tree/toggle-foreground-selected` | `color/primary-text` | Chevron of the selected item, of the selected item with focus and of the selected disabled item: the same color as the label. `color/primary-text` is the text and icon color of the checked item. Precedents: `sidebar/item-foreground-active` and `navigation-menu/current-foreground`. The other tokens with the same value (`tabs/item-foreground-active`, `stepper/marker-foreground-current`, `sidebar/*`) belong to another component (rule 1 of T9); `color/primary-hover` fails with 1.58:1 in the Gerencial brand in dark. |
| `tree/icon-foreground` | `color/muted-foreground` | Folder and file icon outside the selected state (rest, hover, focus and disabled). Own token, because icon and chevron may diverge. |
| `tree/icon-foreground-selected` | `color/primary-text` | Folder and file icon of the selected item. Precedent: `sidebar/item-foreground-active`. |
| `tree/focus-border` | `focus/border` | Focus border ("the one that has to meet 3:1"). Precedents: `tabs/focus-border-color`, `image/focus-border` and `hover-card/focus-border`. |
| `tree/focus-border-width` | `core/focus-width/sm` (2) | Thickness of the border drawn inside the row. `focus/ring-width` belongs to the ring drawn outside, which does not exist here. Precedent: `table/focus-ring-width`. |
| `tree/focus-border-radius` | `radius/control` | Corner of the border drawn inside, equal to the corner of the item. The `focus/border-radius-*` tokens are for a border drawn outside, one step above the corner. |
| `tree/error-icon-foreground` | `status/error` | Icon of the error row. Precedent: `table/status-error-icon`. |

Typography uses text styles, with no token: `text/body-md` for the label and `text/label-md` for the selected label and for "Try again". No effect style and no focus halo.

Variables bound in the sets, outside the family, inside the instances of the approved pieces: `icon/size-sm` and `color/foreground` (nph-icon); `color/primary` (nph-spinner); `border/width`, `color/input`, `color/input-hover`, `color/background`, `color/primary` and `color/primary-foreground` (nph-checkbox); `skeleton/line-height`, `radius/inner` and `color/muted` (nph-skeleton); `space/section`, `space/container-padding` and `scheme/is-light` (nph-empty).

## Anatomy

In the row, from start to end, all centered vertically at the height of the item (`control/height-default`):

1. **Chevron target** — frame of 24 × 24 at the start of the row, centered, with the nph-icon `chevron-right` (closed) or `chevron-down` (open), light, in `color/muted-foreground`; in the selected, selected with focus and selected disabled states, in `color/primary-text`, the same color as the label. On the leaf it is empty and keeps the place, so the label lines up with the labels of the branches. While loading, the nph-spinner sm takes the place of the chevron.
2. **Checkbox** — nph-checkbox without label, with a target of 24, centered, right after the chevron. It shows in multiple selection.
3. **Icon** — nph-icon `folder`, `folder-open` or `file`, light, in the box of `icon/size-sm`, centered, right before the label, in `color/muted-foreground`; when selected, in `color/primary-text`, as the chevron and the label. On every node of the tree or on none.
4. **Label** — `text/body-md` in `color/foreground`, aligned to the start, takes the rest of the row and is cut on one line with an ellipsis at the end. When selected, `text/label-md` in `color/primary-text`.
5. **Selection indicator** — bar in `color/primary-border`, stuck to the left border, from the top to the bottom of the row. It shows on the selected item of single selection.
6. **Focus border** — in `focus/border`, drawn inside the whole row, from start to end, with the corner `radius/control`. On the selected item with focus it covers the bar; the selection stays visible by the background, by the color and by the weight of the label.
7. **Error row** — inside the group, aligned to the indent of the children and centered vertically: the icon `triangle-exclamation` in `status/error`, the phrase "Couldn't load." and the action "Try again" in `text/label-md`.
8. **Group** — stack of the children of an open branch, aligned to the start, with an indent of `core/space/600` on the left at each level and no space between the items.

The tree has no background, border or height of its own: it lives in a card, panel or popover, which gives the surface and the scroll.

## Properties

| Field | Rule |
|---|---|
| `tipo` (item) | `galho fechado` (the default of the set), `galho aberto` and `folha`. The branch carries the chevron; the leaf keeps its place empty, so the labels line up. |
| `estado` (item) | `padrão` (the default of the set), `hover`, `foco`, `selecionado`, `selecionado foco`, `desabilitado`, `selecionado desabilitado` and `carregando`. Hover paints the background (`color/accent`) and the label (`color/accent-foreground`), without moving the focus. Selected and its variants are for single selection; with the checkbox on, they are not used. Disabled fades the whole item with `state/disabled-opacity` and has no hover. Loading exists on the open branch: the nph-spinner replaces the chevron. |
| `checkbox` (item) | Boolean, off by default. On in multiple selection, in every item; checked, unchecked and mixed come from the nph-checkbox instance. On the hover of the item the box goes to `state=hover`; on focus and on disabled it stays in `state=default`. |
| `ícone` (item) | Boolean, off by default. On, it shows the folder on the branch and the file on the leaf, on every node of the tree or on none. |
| `rótulo` (item) | The text of the item. Cut on one line with an ellipsis at the end, with no wrapping. |
| `conteúdo` (group) | `itens` (the default of the set), `carregando` and `erro`. Loading shows nph-skeleton rows on the first load of the tree; a branch that opens later uses the spinner of the item. Error shows the error row in place of the children. |
| `seleção` (tree) | `nenhuma` (the default of the set): opens and closes, with no choice. `única`: one selected item. `múltipla`: checkbox on every item, with the parent mixed when part of the children is checked. |
| `conteúdo` (tree) | `itens` (the default of the set) or `vazio`, with the nph-empty in place of the list. |
| Not a property | Level: comes from the group inside the group, with no axis of its own. Selected with hover: stays equal to selected. Cascade of the selection, load on demand and open all siblings: defined in code. Background, border and height of the tree: come from the container where it lives. |

## Behavior

The base is the WAI-ARIA APG tree view pattern. No deviation from the APG: what differs is in the menu (DSA-45 D-6), and the tree follows the APG.

| Input | What it does |
|---|---|
| Tab | Enters the tree with one Tab stop: the focus goes to the selected item; with no selection, to the first item. The next Tab leaves the tree. |
| Down and Up arrows | Next and previous visible item, without opening or closing. They pass through the disabled item, which receives focus with `aria-disabled` and has no action. |
| Right arrow | On a closed branch, opens it and keeps the focus; on an open branch, goes down to the first child; on a leaf, does nothing. |
| Left arrow | On an open branch, closes it; on a child, goes up to the parent; on a closed root item, does nothing. |
| Home and End | First and last visible item. |
| Enter | Default action of the item: in single selection, selects; in no selection, opens or closes the branch; on the error row, tries to load again. |
| Space | In multiple selection, checks and unchecks, with the cascade; in single selection, selects. |
| Asterisk | Opens all the siblings of the item with focus. |
| Letter | Moves the focus to the next item whose label starts with it. |
| Pointer and focus | Hover paints the background and the label and neither moves the focus nor selects. A click on the chevron opens and closes; a click on the rest of the row selects and puts the focus on the item; in no selection, a click on the row opens and closes the branch. |
| Focus when opening and closing | When a branch opens or closes, the focus stays on it. Closing a parent keeps its open children inside. A click on the chevron of an open parent, with the focus on a child, closes the branch and the focus goes up to the parent. |
| Enter and click in multiple selection | Enter does the default action of the item: on the branch, opens or closes; on the leaf, checks and unchecks. Space checks and unchecks any item. A click on the row checks and unchecks, as a click on the checkbox; a click on the chevron only opens and closes. |
| Esc | The tree alone opens no layer and does not use Esc. Inside a popover or the Tree Select, Esc belongs to the container, which closes and returns the focus to the trigger. |
| Click outside | The tree neither closes nor clears anything: the selection stays. |
| Near the window edge | The tree opens no layer. With many items, the container scrolls, the item does not shrink, and the item with focus shows whole, with the focus border uncut. The Tree Select follows DSA-29 D-2 (near the edge, it opens upward). |
| Load on demand | A branch with no loaded children goes to loading, with `aria-busy`, and the spinner replaces the chevron. On the first load of the tree, the root group shows the skeleton. If it fails, the error row enters the group; Enter on it tries again, and the name read is "Couldn't load. Try again". |
| Multiple selection | Checking the parent checks the children; unchecking a child leaves the parent mixed; the disabled item stays out of the calculation; the cascade can be turned off (`checkStrictly`). |
| Movement | The chevron turns 90 degrees in `motion/expand-duration` and `motion/expand-easing`; with reduced motion, it swaps with no turning. |
| Cut text | The nph-tooltip opens on the focus of the item, at once, and on hover, after `motion/hover-delay`. |
| APG attributes | Roles `tree`, `treeitem` and `group`; `aria-expanded` on the branches; `aria-selected` in single and `aria-checked` in multiple, never both; `aria-multiselectable` in multiple; `aria-level`, `aria-setsize` and `aria-posinset` when not every node is loaded. The tree has a name by `aria-label` or `aria-labelledby`. |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

Combined states (rule T11 of the design system):

- Selected or checked + disabled: the piece keeps the background and the mark of the selection under `state/disabled-opacity` (follows DSA-29 D-3). In the nph-tree, the selected disabled item keeps the background, the bar and the label in `color/primary-text`, with the whole item faded. In multiple selection, the checkbox of the disabled item stays in `state=default`, with the checked mark kept: only the opacity of the item fades the box, once.
- Error + disabled: does not apply to the tree. The item has no error state, and the error row is not disabled.
- Focus + disabled: the disabled item receives focus by the arrows, but Figma has no "disabled with focus" variant. Whether the focus border fades with the item under `state/disabled-opacity` or stays on top at full opacity is open: pending decision D-2 of the task (recommended: on top, at full opacity).
- The error row is a treeitem: it takes the same hover and focus as the item (hover background, focus border inside the row), with no state of its own in Figma.

Limits:

| Case | Rule |
|---|---|
| Depth | No limit in the component; the documentation asks to review the structure above five levels. The tree has the width of the container. |
| Long text | The label is cut on one line with an ellipsis at the end; the whole text shows in the nph-tooltip and reaches the screen reader. |
| Many items | The container scrolls, the item does not shrink. The item that scrolls to the edge of the container shows with the focus border whole, with no cut (WCAG 2.4.11); the container does not clip the row with focus. |
| Empty | The tree in `vazio` shows the nph-empty in place of the list ("No items", "This folder has no items yet."). |
| Short window | Does not apply: the tree opens no layer. |

Inherited decisions:

- Family: tree of nph-table (DSA-49, DSA-56) → nph-tree → nph-tree-select (with nph-select DSA-29 and nph-dropdown-menu DSA-45) and nph-tree-table (with nph-table).
- Follows DSA-29 D-3: selected and disabled keeps the background and the mark under `state/disabled-opacity` (T11, rule 1).
- Follows DSA-29 D3: the text stays on one line, with an ellipsis at the end, with no wrapping.
- Follows DSA-29 D5 in part: hover uses `color/accent` with the text on `color/accent-foreground`; the selected keeps `color/primary-surface` with hover or focus.
- Does not follow DSA-29 D5 on the item active by keyboard: in the tree, the focus is the `focus/border` border, with no hover background (2.56:1 over `color/accent` in the Gerencial brand in dark; pending point 10).
- Follows DSA-45 D-5 in part: only the selected item in single selection takes `color/primary-text` and `text/label-md`; there the checked item takes the check, here the extra mark is the bar.
- Follows DSA-36 D2 (through DSA-70): checked text in `color/primary-text`, not in `color/primary-hover`.
- Follows DSA-72 (approved point: `color/primary-text` on the text and icon of the active item). The tree extends it to the chevron of the selected item.
- Follows DSA-62 D-3 in principle: the arrow turns when the node opens and stays still with reduced motion; here the turn is 90 degrees.
- Does not follow DSA-45 D-6 (the pointer moves the focus in the menu): in the tree, hover only paints (APG tree view; pending point 4).
- Open, with no answer: DSA-17 D7 (hover of the checked checkbox). The tree uses the checkbox as it is.
- Open, with no answer (technical): DSA-45 D-3 (the box takes its own hover on the hover of the item). The tree asks for the same and inherits the same limit (pending point 12).
- For the Tree Select: follows DSA-29 D-2 (near the edge, the list opens upward) and DSA-45 D-1 (`space/inline-tight` between trigger and list).
- Outside the DSA list: follows P101 (DSA-56), keyboard by the APG and `aria-level`, `aria-posinset`, `aria-setsize` and `aria-expanded` on the item. In nph-table the row opens only by the chevron; in nph-tree the chevron opens and the row selects.

Icon and image:

- `chevron-right` (closed) and `chevron-down` (open) of nph-icon, light, at `icon/size-sm`; they do not change weight in any state. Color: `color/muted-foreground`; when selected, `color/primary-text`.
- `folder` (closed branch), `folder-open` (open branch) and `file` (leaf), light, at `icon/size-sm`; they do not change weight when selected. Color: `color/muted-foreground` at rest, in hover, in focus and when disabled; `color/primary-text` when selected.
- `triangle-exclamation`, light, at `icon/size-sm` and in `status/error`, on the error row.
- nph-spinner `size=sm` in place of the chevron, while loading.
- Image: does not apply; the tree has no image.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | The label meets 4.5:1 in both themes, in every active state (WCAG 1.4.3). The chevron meets 3:1 (WCAG 1.4.11): in `color/muted-foreground`, over the background and over the hover; in `color/primary-text`, over the selected, with 7.21:1 in light and 7.46:1 in dark in the brands of lowest contrast (Systems in light, Financeiro in dark). The folder and file icon goes on `color/muted-foreground`, and on `color/primary-text` when selected, and also meets 3:1. The disabled item is exempt, because it is inactive. |
| visible focus | Border in `focus/border`, at the thickness `core/focus-width/sm`, inside the row, with more than 3:1 over the background and over the selected in both themes (WCAG 1.4.11 and 2.4.13). It stays inside because the items stack with no space, and a ring outside would be cut by the neighbor. The item with focus does not take the hover background, even with the pointer over it. |
| focus when scrolling | When the focus goes down to an item outside the visible area, the container scrolls until the whole row shows, with the focus border uncut at the edge of the container (WCAG 2.4.11). |
| color is not the only sign | Selected: background, bar at the left and label in medium weight (WCAG 1.4.1); on the branch, the chevron follows the color of the label. On selected with focus, the focus border covers the bar and the selection goes on by the background, the color and the weight. Checked and mixed: the checkbox itself. Open and closed: the chevron. Error: icon and phrase. |
| target size | The whole row is the target, at the height `control/height-default`. The chevron and the checkbox have a target of 24 × 24 (WCAG 2.5.8). |
| accessible name | Each item is read by its label; chevron and icon stay `aria-hidden`. The error row is read as "Couldn't load. Try again", and Enter on it tries again. The cut label shows whole in the nph-tooltip, on focus and on hover, and reaches the screen reader whole. The tree has a name by `aria-label` or `aria-labelledby`. |
| keyboard | The tree has one Tab stop; inside it, the focus moves by the arrows, as in the WAI-ARIA tree pattern (arrows, Home, End, Enter, Space, asterisk and letter). |

Measures and contrasts read in Figma (7 brands, two themes): item 36; chevron target 24 × 24 with a chevron of 16; item padding `space/inline`; space between parts `space/inline-tight`; indent `core/space/600` per level; tree with `space/inline-tight` around and 0 between items; error row 36, at the indent of the children. Label `color/foreground` 21:1 and 14.73:1; `color/primary-text` over `color/primary-surface`, 7.21:1 at least (Systems, light); `color/accent-foreground` over `color/accent` 16.84:1 and 7.68:1. Chevron `color/muted-foreground` 6.69:1 and 9.81:1 over the background, 5.76:1 and 5.11:1 over `color/accent`; `status/error` 6.88:1 and 5.01:1; bar `color/primary-border` over `color/primary-surface`, 4.64:1 at least (Education, light). Focus: `focus/border` over the background, 4.32:1 at least (Comercial, light); over `color/primary-surface`, 3.85:1 at least (Comercial, light), the worst focus of the piece; over `color/popover`, 3.31:1 at least (Gerencial, dark), the case of the Tree Select. Over `color/accent` it measures 2.56:1 in the Gerencial brand in dark: this is why the focus wins over the hover.

## Relations and context

| With | Rule |
|---|---|
| Container | The tree has no background, border or height of its own: it lives in a card, panel or popover, which gives the surface and the scroll. With many items, the container scrolls; the item does not shrink. |
| Inside pieces | Each inner piece controls its own color and its own focus drawing: nph-checkbox, nph-icon, nph-spinner, nph-skeleton and nph-empty. Inside the item, the checkbox does not receive Tab: the focus drawn is the one of the item. |
| Spaces | `space/inline` on the sides of the item, `space/inline-tight` between the parts of the row and around the tree, `core/space/600` of indent per level. |
| Cut label | The nph-tooltip shows the whole text on the focus of the item, at once, and on hover, after `motion/hover-delay`. |
| Node actions | Actions such as rename and delete go to the nph-context-menu opened by the item; the row carries no button. |

## When to use

| Situation | Choice |
|---|---|
| Choose a folder, unit or category inside a hierarchy | Single selection |
| Check several branches at once, such as permissions by area | Multiple selection, with the parent mixed showing the partial choice |
| Explore and open, without choosing | No selection |
| The data are folders and files | Icon on; with other data, no icon |
| A deep tree | The component does not limit the levels; above five, review the structure before using it |

## Required examples

a) Choose the destination folder, in single selection. b) Check permissions by area, in multiple selection, with the parent mixed. c) A branch that loads and a branch that failed to load. Each in light and dark. The documentation also shows the focus inside the row, the selected item with focus (the border covers the bar), the hover in multiple selection (the box takes its own hover), the error row, the tree with `space/inline-tight` around the items, the cut label with the nph-tooltip, and the wrong examples.

## Do

| Do | Why |
|---|---|
| Use an icon on every node of the tree or on none | The column of the labels stays aligned |
| In multiple selection, leave the parent mixed when part of the children is checked | It shows the partial choice without opening the branch |
| On entering the tree, put the focus on the selected item; with no selection, on the first item | The person goes on from where they stopped |
| Leave the disabled item in the tree, within reach of the arrows | The person knows it exists, even without being able to choose it |
| In multiple selection, prefer the icon off | Icon and checkbox together widen the start of each row and push the label |

## Do not

| Do not | Use instead |
|---|---|
| Turn the checkbox on in the selected item: they are two marks for the same choice | The checkbox in multiple selection or the selected item in single selection |
| Mix nodes with icon and without icon | Icon on all or on none |
| Use the tree as the main navigation menu | The nph-sidebar |

## Pending points answered

All approved as recommended in the appendix, except point 7, which stays open.

| Point | Answer |
|---|---|
| 1. Height of the item | 36, on `control/height-default`. It lines the Tree Select up with the lists of the select and of the dropdown and gives room. The only semantic token of 32, `space/section`, is of another function. |
| 2. Hover | `color/accent`, with the text on `color/accent-foreground`. `color/primary-surface` is for the selected: hover and selected must be distinct. |
| 3. Focus inside or outside | Inside, in `focus/border`, at the thickness `core/focus-width/sm`. Items stacked with no space cut a ring drawn outside; the tree of nph-table already draws the focus inside (P101). |
| 4. Does the hover move the focus? | No; hover only paints. In the tree, the APG separates focus from hover; moving the focus on mouse over would scroll and read nodes by accident. |
| 5. Error when loading the children | Error row inside the group, with the icon, "Couldn't load." and "Try again" as the action of the treeitem itself; Enter tries again. No button inside the item: the node has one action only. "Try again" is told apart by the weight and by the accessible name. |
| 6. Loading: spinner or skeleton | nph-spinner sm in place of the chevron when a branch opens; skeleton rows only on the first load of the tree. The spinner in place of the icon is the precedent of the nph-dropdown-menu item; an arrow that turns does not read as loading. |
| 7. Tree Table against the tree of nph-table | **Open.** The recommendation is to keep both: the Tree Table reuses the cell of the tree of nph-table (`2571:66335`), which is already a treegrid. The row of a table has cells and widgets; the treeitem does not. It is decided in the plan of the Tree Table, not in this task. |
| 8. Maximum depth | No limit in the component; the documentation asks to review the structure above five levels. The tree has the width of the container. |
| 9. Guide lines | None. Soft style: space before a divider. If they come in, it is the vertical nph-separator, with no new token. |
| 10. Focus with the pointer over | The focus wins over the hover; the item with focus stays without the hover background. `focus/border` over `color/accent` measures 2.56:1 in the Gerencial brand in dark, below 3:1; over the background, 4.32:1 at least. |
| 11. Indent | 24, on `core/space/600`. It is the most common in the market; 28 would line the chevron of the child under the checkbox or the icon of the parent and has the precedent of nph-table. |
| 12. Checkbox on the hover of the item | The box takes its own hover (`color/input-hover`). `color/input` over `color/accent` measures 2.78:1 in light; `color/input-hover`, 4.08:1 and 5.11:1. It is what the evidence of the dropdown asks (DSA-45 D-3). |
| 13. Color of the folder and file icon | `color/muted-foreground` at rest, in hover, in focus and when disabled; `color/primary-text` when selected. It follows the chevron and keeps the label ahead (6.69:1 and 9.81:1 over the background); when selected, it follows the label, as in the active sidebar (7.21:1 at least). |
| 14. Semantic tokens outside the description, and new descriptions | Keep the uses and record the new descriptions: `space/inline-tight` also between the parts of a dense row of a list, tree or menu and as room around that list; `color/primary-border` also as the 2 px bar of the selected item over `color/primary-surface`; `color/primary-surface` also as the background of the selected item of lists and trees, with `color/primary-text` on the text; `core/space/600` also as the indent of each level of the tree; `core/focus-width/sm` also as the 2 px selection bar. Precedents: `table/cell-gap-tight`, `navigation-menu/panel-padding`, `progress/indicator-background` and `sidebar/item-background-active`. |
| 15. Color of the chevron on the selected item | `color/primary-text`, the same color as the label (7.21:1 and 7.46:1 over `color/primary-surface`). The color painted in the corrections board, `color/primary`, measures 2.86:1 in the Gerencial brand in dark, below the 3:1 of WCAG 1.4.11; `color/primary-border` would work (4.64:1 and 5.17:1), but its description forbids use on text and fill. Of the 13 systems read with a selected style, none uses a brand tone on the chevron different from the label. |

## Outside this task

Finding recorded for the foundation, with no change in this task: `data-table/row-selected-indicator` on `color/primary` measures 2.86:1 over `color/primary-surface` in the Gerencial brand in dark, the same failure that took the tree to `color/primary-border`. The same holds for `dropdown/item-hover-icon-foreground` on `color/primary` and for the check of the selected option of the nph-select, over `color/primary-surface`. They are not pending points of the tree.
