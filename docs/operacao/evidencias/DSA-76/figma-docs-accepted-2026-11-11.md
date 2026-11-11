```json
{
  "task": "DSA-76",
  "gate": "figma-docs-accepted",
  "date": "2026-11-11",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5928-2591",
    "date": "2026-11-11",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner accepted the panel menu documentation frame (5928:2591, page 4128:29872), the appendix (5928:2867), COMPONENT_SET nph-panel-menu subgroup (5607:97) and COMPONENT_SET nph-panel-menu (5608:168), with the Figma UX QA and the textual audit approved, and approved the points of the approval page: panel-menu/nest-gap straight on core/space/300; panel-menu/label-gap on space/stack-snug; the panel menu is a navigation mode of the nph-sidebar with no new public tag; it enters v1 as a mode of the nph-sidebar, in a new task linked to DSA-72; the group of the current page and its parents are born open, and if the person closes one it stays closed, with no new mark; collapsed and mobile follow the nph-sidebar (DSA-72); several groups stay open at once, and opening one does not close the others. The other 27 tokens bind to existing semantic tokens with no new value (the deviations from the description are declared, with the precedent of DSA-72); that item is only a record. No pending point of the component stays open. The specification, converted to text, is in the rest of this file."
  }
}
```

# DSA-76 — `figma-docs-accepted`

The documentation of the panel menu (frame `5928:2591`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The panel menu is a navigation mode of the `nph-sidebar`, with no new public tag, and enters the first version of Nephos in this task, linked to DSA-72. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New: 29 semantic tokens, `panel-menu/*`. Every layer of the two Figma sets is bound to them; the visual did not change. No semantic token was created outside this family.
- No new value in core (rule T9): every token points to a semantic token, except `panel-menu/nest-gap`, which points straight to `core/space/300` (12) by decision (rule 3). Reason: no semantic token has the function of an indent of nested levels. `space/control-padding` (12) is the inner padding of button, field and select, and `space/inline-loose` (12) is the one of a footer.
- `panel-menu/label-gap` points to `space/stack-snug` (8), the vertical space after a header, the closest function: `space/inline` is horizontal.
- Where the panel menu repeats the function of a piece of the `nph-sidebar`, the token points to the `sidebar/*` token that already describes it (precedent: the approved items of DSA-72). Uses outside the description, declared: `panel-menu/subgroup-padding-y` and `panel-menu/subgroup-gap` on `space/inline` (the description speaks of elements side by side; the approved sub item has 8 and 8); `panel-menu/subgroup-padding-x`, `panel-menu/nest-padding` and `panel-menu/skeleton-row-padding` on `sidebar/item-padding`, and `panel-menu/skeleton-row-height` on `sidebar/item-height` (the description says "not outside the sidebar": the panel menu is a mode of the sidebar); `panel-menu/skeleton-gap` on `space/control-padding` (as the approved loading row, icon to label).
- `panel-menu/expand-duration` and `panel-menu/expand-easing` point to `motion/expand-duration` and `motion/expand-easing`: the block grows in place. `motion/enter-*` is for a layer that appears on top. The repository keeps tokens of component movement in the semantic collection, as aliases of `motion/*` (for example `{motion.state-duration}` and `{motion.hover-close-delay}` in other families); here the two tokens are aliases of `motion/expand-duration` (duration) and `motion/expand-easing` (cubic bezier).
- Left without a component token: the pieces by instance use their own tokens (item, sub item and section label of the `nph-sidebar`, `nph-skeleton`, `nph-tooltip`, `nph-icon`); the typography of the label comes from the text styles (`text/body-md`, and `text/label-md` in the open subgroup). No shadow style.
- The `use` of fifteen semantic tokens in `design.md` now names the nph-panel-menu where the accepted Figma uses them: `control/height-default`, `space/inline`, `space/inline-tight`, `space/stack`, `space/stack-snug`, `space/control-padding`, `icon/size-sm`, `icon/size-md`, `state/disabled-opacity`, `focus/border`, `focus/halo`, `focus/ring-width`, `border/width`, `motion/expand-duration` and `motion/expand-easing`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks (`aberto`, `não`, `sim`, `estado`, `repouso`, `hover`, `foco`, `desabilitado`, `pronto`, `carregando`, `rótulo`, `dica`). Names of the pieces in Portuguese are between backticks only here; in the prose they are in English (subgroup, group line, nested level, section label, loading row).

## Purpose

Organizes the navigation of a system with many destinations in groups that open and close in place, up to the third level, with no side panel. It shows where the person is: the group of the current page stays open and the current page is marked.

Use it in the place of the navigation list of the expanded `nph-sidebar`, when the destinations reach the third level. It is a mode of the navigation of the `nph-sidebar`, with no new public tag. It does not replace: the `nph-sidebar` in today's mode, where the third level opens in a panel at the side; the `nph-navigation-menu`, a horizontal bar; the `nph-tree`, a tree of data; nor the `nph-accordion`, which shows content and does not navigate.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-panel-menu subgroup set (`nph-panel-menu / subgrupo`) | `5607:97` | `aberto` (`não`, `sim`) × `estado` (`repouso`, `hover`, `foco`, `desabilitado`); text `rótulo`; boolean `dica`. 8 variants. |
| nph-panel-menu (`nph-panel-menu`) | `5608:168` | `estado` (`pronto`, `carregando`). 2 variants. |

Item, sub item and section label come by instance of the approved `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-label` (type group), with their own properties and tokens. The loading shows `nph-skeleton` rows. The `nph-tooltip` shows the cut label. The arrow is the `nph-icon`.

## Tokens

The first value is light and the second is dark; one value means the same in both. All tokens are in one family, `panel-menu/*`, in the semantic collection, and every one has the same alias in light and in dark; the final color still changes by mode, through the token it points to. One of them points straight to core, by decision.

| Token | Points to | Where it is used, and why |
|---|---|---|
| `panel-menu/subgroup-height` | `control/height-default` (36) | Height of the subgroup area; the subgroup is a button. The only semantic token of 36. Precedent: the `nph-sidebar-subitem`. |
| `panel-menu/subgroup-padding-x` | `sidebar/item-padding` (10) | Side padding of the area. The subgroup is a piece of the sidebar. `core/space/off-scale/10`, behind it, asks for a value of the scale. Precedent: the approved sub item. |
| `panel-menu/subgroup-padding-y` | `space/inline` (8) | Top and bottom padding of the area. Declared deviation: the description speaks of elements side by side; it follows the approved sub item and `navigation-menu/trigger-padding-y`. `space/stack-snug` (8) is for a header; `core/space/200` is for a compact control. |
| `panel-menu/subgroup-gap` | `space/inline` (8) | Gap between the label and the arrow. Declared deviation: inside a unit the description asks for `space/inline-tight` (4); it follows the approved sub item, which has 8 between label and arrow. |
| `panel-menu/subgroup-radius` | `sidebar/item-radius` (12) | Corner of the area, the same of the approved item and sub item. `core/radius/500` is for a floating layer; no semantic radius has 12. |
| `panel-menu/subgroup-foreground` | `sidebar/item-foreground` | Label and arrow of the closed subgroup. Not in the open one. `color/foreground` and `color/secondary-foreground` have another light and dark pair. |
| `panel-menu/subgroup-foreground-open` | `sidebar/item-foreground-open` | Label and arrow of the open subgroup. Not in the closed one. It points to `color/primary-text` (T13). |
| `panel-menu/subgroup-background-hover` | `sidebar/item-background-hover` | Background with the pointer over it, open or closed. Not with focus, nor disabled. The text follows `panel-menu/subgroup-foreground`. |
| `panel-menu/subgroup-icon-size` | `icon/size-sm` (16) | Box of the arrow. Precedent: the arrows of the approved item and sub item. |
| `panel-menu/subgroup-disabled-opacity` | `state/disabled-opacity` | Whole disabled subgroup. Precedent: the approved item and sub item. |
| `panel-menu/focus-border` | `focus/border` | Focus border of the subgroup; it is the one that meets 3:1. The rule for a new piece is never the focus color copied from an approved piece. Precedents: `tabs/focus-border-color` and the item, sub item and rail button of the `nph-sidebar`. |
| `panel-menu/focus-border-width` | `border/width` (1) | Thickness of the focus border. Precedent: the approved item. |
| `panel-menu/focus-border-radius` | `focus/border-radius-sidebar-item` (13) | Corner of the focus border. `focus/radius-container` (13) is a halo token. Precedent: the approved item and sub item. |
| `panel-menu/focus-ring` | `focus/halo` | Focus halo, outside the border. Decoration, with no 3:1. |
| `panel-menu/focus-ring-width` | `focus/ring-width` (4) | Thickness of the halo. `space/inline-tight` and `radius/inner` (4) are not a ring. |
| `panel-menu/focus-radius` | `focus/radius-sidebar-item` (17) | Corner of the halo. Precedent: the approved item. |
| `panel-menu/nest-padding` | `sidebar/item-padding` (10) | Indent of the second and the third level: it puts the group line where the icon of the item above starts. Declared deviation: 8 or 12 would take the line off the alignment. Precedent: the second level of the `nph-sidebar` (DSA-72). |
| `panel-menu/nest-gap` | `core/space/300` (12) | Gap between the group line and the column of items of the second and the third level. Straight to core by decision (rule 3): no semantic token has the function of a nested indent. `space/control-padding` (12) is the inner padding of button, field and select; `space/inline-loose` (12) is the one of a footer. |
| `panel-menu/guide-background` | `sidebar/group-line` | Color of the line of the open group. Not as a divider between groups. It points to `color/primary-surface`. `color/border` has another value. Precedent: the group line of the `nph-sidebar` (DSA-72). |
| `panel-menu/guide-width` | `border/width` (1) | Thickness of the group line. Precedent: the same line. |
| `panel-menu/item-gap` | `space/inline-tight` (4) | Gap between the rows of the main list, of the section, of the second and the third level and of the loading. Rule T6 (list and menu). Precedent: the items of the navigation of the `nph-sidebar`; also `navigation-menu/group-gap`. |
| `panel-menu/section-gap` | `space/stack` (16) | Gap between the main list and each section. Precedent: the navigation of the `nph-sidebar`. |
| `panel-menu/label-gap` | `space/stack-snug` (8) | Gap between the section label and its items. `space/stack-snug` is the vertical space after a header, the closest function; `space/inline` is horizontal. |
| `panel-menu/expand-duration` | `motion/expand-duration` (250) | Turn of the arrow and growth of the block when it opens and closes. `motion/enter-duration` is for a layer that appears on top. |
| `panel-menu/expand-easing` | `motion/expand-easing` | Curve of the same expansion. `motion/hover-easing` and `motion/state-easing` are for hover and change of state. |
| `panel-menu/skeleton-row-height` | `sidebar/item-height` (40) | Height of the loading row, in the place of an item. Declared deviation from "not in another piece": the panel menu is a mode of the sidebar. Precedent: the loading row of the `nph-sidebar` (DSA-72). |
| `panel-menu/skeleton-row-padding` | `sidebar/item-padding` (10) | Side padding of the loading row. Same reason. |
| `panel-menu/skeleton-gap` | `space/control-padding` (12) | Gap between the icon place and the text line of the loading row; it follows the approved item (icon to label). |
| `panel-menu/skeleton-icon-size` | `icon/size-md` (20) | Icon place of the loading row. Precedent: the icon of the approved item. |

Typography uses text styles, with no token: `text/body-md` for the closed label and `text/label-md` for the open label. No effect style.

Variables bound in the sets, outside the family, inside the instances of the approved pieces: the item, the sub item, the section label (`nph-sidebar-*`), the `nph-skeleton` and the `nph-tooltip` keep their own tokens.

## Anatomy

In the panel menu, from top to bottom, the main list and then each section; in the open group, from start to end, the indent, the group line and the column of items; in the subgroup, from start to end, the label and the arrow.

1. **First-level item** — instance of the `nph-sidebar-item` (link, counter, closed group or open group), 40 high, aligned to the start, in a column, `panel-menu/item-gap` (4) from the neighbor. Icon at the start, label, and counter or arrow at the end.
2. **Indent and group line** — horizontal frame aligned to the top: indent of 10 at the start (`panel-menu/nest-padding`), a line of 1 px in `panel-menu/guide-background` that stretches to the height of the children, and the column of items 12 from it (`panel-menu/nest-gap`).
3. **Sub item** — instance of the `nph-sidebar-subitem`, 36 high, filling the width of the column, aligned to the start, with no icon. In the second level the text starts 33 from the edge.
4. **Subgroup** — button of the second level that opens the third in place. Area of 36 filling the column, content centered vertically, 10 on the sides and 8 on top and bottom, corner 12 (`sidebar/item-radius`). Label at the start, in `text/body-md` and `sidebar/item-foreground` when closed, or `text/label-md` and `sidebar/item-foreground-open` when open; arrow `chevron-down` or `chevron-up` of 16 at the end, 8 from the label, in the color of the label.
5. **Third level** — the same recipe of the second (indent, line and column, aligned to the top), inside the column of items of the second; the text of the sub item starts 56 from the edge.
6. **Section label** — instance of the `nph-sidebar-label` type group, at the top of the section, aligned to the start, 8 from the items (`panel-menu/label-gap`). Between the main list and the section, 16 (`panel-menu/section-gap`).
7. **Focus of the subgroup** — border of 1 px in `focus/border`, 1 px outside the area (corner 13), and halo of 4 in `focus/halo` outside the border (corner 17), both centered on the area. No frame cuts the ring.
8. **Tooltip** — `nph-tooltip` at the right of the subgroup, 8 from the area and centered vertically; shows the whole label when it is cut (property `dica`).

The panel menu has no background, border or margin of its own: it lives on `sidebar/panel-background`, the background of the panel of the `nph-sidebar`, and fills the useful width of the sidebar (206 in the preview).

Measures, read in the 8 variants of the subgroup and in the 2 of the panel menu:

| Measure | Value |
|---|---|
| first-level item | 40 high (`sidebar/item-height`); the text starts 42 from the edge (10 + 20 + 12) |
| sub item and subgroup | 36 high (`control/height-default`) |
| subgroup | 10 on the sides, 8 on top and bottom, 8 between label and arrow, corner 12, arrow 16; 183 wide in the set, fills the column in the menu |
| indent | second level: line 10 from the edge, text of the sub item 33 from it (10 + 1 + 12 + 10); third level: 23 more, line at 33 and text at 56 |
| width | 206, the useful area of the `nph-sidebar` (256 − 2 × 24 − 2 × 1); the label has about 140 in the third level and 139 in the subgroup of the second; above that, it is cut |
| focus of the subgroup | border at x/y −1, (width + 2) × 38, corner 13; halo at x/y −5, (width + 10) × 46, corner 17; both layers ABSOLUTE, with stroke INSIDE and constraints STRETCH; no frame of the menu clips |
| tooltip | ABSOLUTE, 8 from the area (x = width + 8), centered vertically, hidden by default |
| gap of the panel menu variants | it is in the navigation frame; the root of the variant has gap 0 |
| cut text, on purpose | "Reports of the registry" is cut in the second level to show the cut; the tooltip brings the whole text |

## Properties

| Field | Rule |
|---|---|
| `estado` (panel menu) | `pronto` (the default) or `carregando`. The loading swaps the list for `nph-skeleton` rows, one per first-level item, in the same place and with no section label. |
| `aberto` (subgroup) | `não` (the default) or `sim`. With `sim`, the third level shows below, the arrow becomes `chevron-up` and the label goes to `text/label-md` in `sidebar/item-foreground-open`. |
| `estado` (subgroup) | `repouso` (the default), `hover`, `foco` or `desabilitado`. Active does not apply: the subgroup opens and closes and does not navigate; the current page stays in the sub item. |
| `rótulo` (subgroup) | Text of the subgroup. Default: "Institutions". Short; if it does not fit, it is cut with an ellipsis at the end. |
| `dica` (subgroup) | Boolean; turns on the `nph-tooltip` at the right of the subgroup. Default: off. Turn it on when the label is cut. |
| Combined states | See "Combined states" below. |
| Pieces by instance | Item: type, state, label, counter, icon, solid icon, tooltip and more actions, all of the approved `nph-sidebar-item`. More actions turns on the action button at the end of the item, in the first level: a `nph-icon-button` secondary ghost compact. Sub item: label, state and tooltip, with options = no. Section label: `nph-sidebar-label` type group. |
| Not a property | Levels and number of items come from the nesting, with no axis, as in the `nph-sidebar`. Several groups stay open at the same time: opening one does not close the others. The group of the current page and its parents are born open; if the person closes one of them, it stays closed. |

## Behavior

The base is the WAI-ARIA APG disclosure navigation pattern. No deviation from the APG.

| Situation | What happens |
|---|---|
| Tab and Shift+Tab | They pass through the buttons (group and subgroup) and the visible links, in the order of the list. What is in a closed group stays out (`hidden`); the disabled one too. |
| Enter or Space on the group or subgroup | Opens or closes the block below; `aria-expanded` changes; the focus stays on the button. |
| Enter on the link | Follows the link. Space does not follow, as in every link. |
| Arrows, Home and End | Not used: the APG marks these keys as optional in the disclosure navigation. |
| Focus when opening and closing | It stays on the button that opened or closed; the first child comes on the next Tab. |
| Esc | Does nothing: the open block grows in place and is not a layer on top. |
| Click outside | Closes nothing. |
| Click on the group or subgroup | Opens or closes; does not navigate. |
| Pointer and focus | Hover paints the background (`panel-menu/subgroup-background-hover`) and does not move the focus. The tooltip appears on hover after `motion/hover-delay` and on focus with no wait; a click cancels the wait. |
| Current page | The link carries `aria-current="page"`, one per page. The parent groups are born open and stay closed if the person closes them. Several groups stay open at the same time. |
| Near the window edge | It does not flip or shrink: the block grows in place and the navigation scrolls inside the `nph-sidebar`, with top and bottom in place. |
| Movement | The arrow turns 180 degrees and the block grows in place in `panel-menu/expand-duration` with `panel-menu/expand-easing`; with reduced motion, nothing moves. |
| Loading | The skeleton rows stay in the place of the list, with no focus and out of the Tab order. |
| Collapsed and mobile | They are modes of the `nph-sidebar` (DSA-72); the panel menu follows them. It has no collapsed mode of its own. |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

Combined states (rule T11 of the design system):

- Open + disabled: rule 1, by analogy (open is a mark of state of the piece, as selected is): keeps `text/label-md` in the open color and the arrow `chevron-up`, under `state/disabled-opacity`. The approved open group item, disabled, already does so.
- Open + hover: keeps the open and adds the hover background, as the approved open group item in hover.
- Error + disabled: rule 2 does not apply: the menu has no error.
- Current + disabled: does not apply: the current page is not disabled, and the subgroup has no active state.
- Focus + disabled: the rule of focus on a disabled control (the APG focusability of disabled controls) does not apply: the subgroup is a disclosure button (DSA-62 D-1), not an item of a composite widget. The disabled subgroup stays out of the Tab order.
- The label and the arrow of the subgroup use the same color pair in the 8 variants: `sidebar/item-foreground` closed, `sidebar/item-foreground-open` open.

Limits:

| Case | Rule |
|---|---|
| Levels | Up to three. More than three levels ask for another screen or tabs. |
| Long text | The label is cut on one line with an ellipsis at the end; the whole text shows in the `nph-tooltip` and reaches the screen reader. About 140 of width in the third level. |
| Width | 206, the useful width of the `nph-sidebar`; it fills the column and has no width of its own. |
| Many items | The navigation scrolls inside the `nph-sidebar`, between top and bottom. The item does not shrink. |
| Few destinations | With two levels or fewer than five destinations, use the `nph-sidebar` without the panel menu. |
| Group as a link | Not allowed: the click opens and closes. Put the destination in a link inside the group. |
| Short window | Does not apply: the block grows in place and opens no layer. |

Inherited decisions:

- Family: side navigation — `nph-sidebar-item` (DSA-53) → `nph-sidebar` (DSA-72) → panel menu; neighbor of behavior: `nph-navigation-menu` (DSA-62).
- Follows DSA-36 D2 (and T13): the open and current text uses `color/primary-text` (here `panel-menu/subgroup-foreground-open`; in the approved pieces, `sidebar/item-foreground-open` and `sidebar/item-foreground-active`).
- Follows DSA-62 D-1 (batch 2): each trigger is a collapsed row with the arrow; a touch opens the links below and turns the arrow. In the panel menu, in every width.
- Follows DSA-62 D-3 (batch 2): the arrow turns 180 degrees when opening and, with reduced motion, nothing moves.
- Deviation from DSA-62 D-3, declared: the block does not appear with `motion/enter-*` and `motion/exit-*`; it grows in place with `motion/expand-*`. Reason: `motion/enter-duration` is for a layer that appears on top; `motion/expand-duration` is for a piece that grows in place.
- Follows DSA-62 D-5 (batch 1): the current uses `color/primary-text`, with at least 4.5:1 in the 7 brands.
- Follows DSA-48 D1: the tooltip of the cut label waits `motion/hover-delay` on hover; the focus does not wait. A click cancels the wait (rule of the tabs evidence).
- Follows T11: rule 1, by analogy, in the open disabled subgroup; rule 2 does not apply.
- Follows DSA-53 D-4, answered by the accepted Figma (DSA-72): the sub item with options opens the third level as a disclosure, with `aria-expanded` and `aria-controls`. In the panel menu the subgroup opens the third level in place, with the same `aria-expanded` and `aria-controls`, and the sub item with options stays out of it.
- Follows DSA-53 D-3, answered by the accepted Figma (DSA-72): more actions is a `nph-icon-button` secondary ghost compact; the panel menu only uses the boolean of the approved piece.
- DSA-53 D-1 and D-2 (counter of the rail button): answered by the accepted Figma (DSA-72); no effect here, the panel menu has no collapsed mode.
- DSA-62 D-2 (current of the trigger derived from the current link): stays open; the panel menu treats the point as answered below (the group of the current page is born open).
- DSA-62 D-4 (wait to close on hover): does not apply; the panel menu opens and closes by click.
- Follows the behavior outside Figma of DSA-72, in what concerns the navigation: Tab order, `aria-busy` in loading, limits and combined states.

Icon and image:

- The arrow of the subgroup: `nph-icon` `chevron-down` (closed) and `chevron-up` (open), light in both, at `icon/size-sm`, in the color of the label, with `aria-hidden`. The icon stays in each variant, with no swap property.
- Icon of the item (approved piece): `nph-icon` light at rest, hover, focus and disabled; it swaps to solid in the open group and in the current one, by the solid icon property; `icon/size-md` (20).
- Icons of the examples: `grid-2`, `inbox`, `folder` and `folder-open`, `calendar`, `file`, `gear` and `circle-question`, all of the `nph-icon` (Font Awesome).
- External link: out; the icon does not exist in the `nph-icon` and there is no case.
- Image: does not apply; the panel menu has no image.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | The labels meet 4.5:1 over `sidebar/panel-background` and over the hover background, in both themes and in the 7 brands; the lowest, in the default brand, is 5.84. The open label, in `color/primary-text`, measures 5.78 at least over the panel; over the hover, 7.21 and 7.46 (lowest of the 7 brands). The group line, in `sidebar/group-line`, is decorative (1.12 in light and 1.41 in dark, default brand): the indent and the order show the level (WCAG 1.4.3 and 1.4.11). |
| visible focus | In the subgroup, the item and the sub item, the border of 1 px in `focus/border` meets 3:1 in all brands, in light and in dark (lowest 3.38, in light, Comercial brand); the halo in `focus/halo` is decoration and does not need to meet it (WCAG 2.4.7 and 1.4.11). The approved item and sub item come by instance, with their focus, also in `focus/border`. |
| color is not the only sign | Open group and subgroup: heavier label weight and the arrow up. Current page: heavier label weight in the approved item and sub item, and `aria-current`. Disabled: opacity `state/disabled-opacity` and out of the Tab order (WCAG 1.4.1). |
| target size | The whole row is the target: 40 high in the first level and 36 in the second and the third, above the minimum of 24 (WCAG 2.5.8). |
| name and roles | `nav` with `aria-label` (for example "Main navigation"). Group and subgroup are `button` with `aria-expanded` and `aria-controls`; the closed list stays with `hidden`. The current page carries `aria-current="page"`, one per page. Icons and arrow with `aria-hidden`. No `role="menu"` and no `role="tree"` (APG disclosure navigation). |
| keyboard | Tab and Shift+Tab pass through the visible buttons and links, in the order of the list; Enter and Space open and close the group and the subgroup; Enter follows the link. |
| cut text | Label on 1 line with an ellipsis; the tooltip (`nph-tooltip`) shows the whole text on hover, after `motion/hover-delay`, and on focus, with no wait; a click cancels the wait (WCAG 1.4.13; DSA-48 D1). |
| movement | The arrow turns 180 degrees and the block grows in place in `panel-menu/expand-duration`, with `panel-menu/expand-easing`; with reduced motion, nothing moves (WCAG 2.3.3). |

Contrast of the focus of the subgroup: `focus/border` 4.26 in the default brand, in light; lowest of the 7 brands 3.38 in light (Comercial) and 4.81 in dark. Halo `focus/halo`: 1:1 in light and 1.52 in dark, decoration. Group line over `sidebar/panel-background`, default brand: `sidebar/group-line` 1.12 in light and 1.41 in dark; `color/border` 1.34 and 2.72.

## Relations and context

| With | Rule |
|---|---|
| Inside | The expanded `nph-sidebar`, in the place of the navigation list. Top and bottom belong to the sidebar, and the navigation scrolls between them. Collapsed and mobile follow the `nph-sidebar`. |
| With `nph-sidebar-item`, `nph-sidebar-subitem` and `nph-sidebar-label` | They come by instance and keep their own tokens. |
| With `nph-skeleton` | The rows of the loading. |
| With `nph-tooltip` | The tooltip of the cut label. |
| Difference from today's mode of the sidebar | There, the sub item with options opens the third level in a panel at the side; here, the subgroup opens the third level in place. In both, the button carries `aria-expanded` and `aria-controls`. |
| Who controls | The page says which page is the current one; the panel menu opens and closes the groups by click or keyboard, and the code can control which stay open. The change is in place: the arrow turns and the block grows in `panel-menu/expand-duration`. |

## When to use

| Situation | Choice |
|---|---|
| A system with many destinations in up to 3 levels, where the person needs to see the whole path without leaving the column: registries, reports, settings | Panel menu |
| A category that needs a page | A link inside the category |
| 2 levels or fewer than 5 destinations | The `nph-sidebar` without the panel menu |
| More than 3 levels | Another screen, or tabs inside the page |

## Required examples

Cases of use, with instances of the sets, in light and in dark: the main list with section ("Registries" open, with the current page in the third level, "Units"); the loading, in the same place of the list; a long label cut in the second level, with the tooltip on hover. The documentation also shows the combined states (open and disabled, open and hover) and the item with more actions turned on (hover), and the focus with the tooltip appearing with no wait, in light and dark.

## Do

| Do | Why |
|---|---|
| Use short labels | In the third level the label has about 140 of width; what goes over is cut and goes to the tooltip |
| Leave open the group of the current page and its parents | The person sees where they are |
| Use group and subgroup as buttons that open and close; the destination stays in a link inside them | The click never navigates from a category |
| Separate blocks by space and section label, with no divider between the items | Soft style: space before a divider |
| Keep the arrow at the end of the row, in the same position in every level | The column of arrows stays aligned |

## Do not

| Do not | Use instead |
|---|---|
| Use more than 3 levels | Split into screens or use tabs inside the page |
| Use a group that is also a link: the click opens and closes | Put the destination in a link inside the group |
| Use it as a tree of data, of folders or files | The `nph-tree` |
| Use it with 2 levels or fewer than 5 destinations | The `nph-sidebar` |
| Place it loose on the page, outside the `nph-sidebar`: the panel menu has no background or margin of its own | Inside the `nph-sidebar` |

## Pending points answered

All the pending points of the component are closed.

| Point | Answer |
|---|---|
| 1. What the panel menu is in the code | A navigation mode of the `nph-sidebar` (accordion, third level in place), with no new public tag. |
| 2. Does it enter v1? | Yes, as a mode of the `nph-sidebar`, in a new task linked to DSA-72 (this task). |
| 3. Closed group that holds the current page | The group of the current item is born open; if the person closes it, it stays closed, with no new mark. The same for the parents. |
| 4. Radius of the subgroup | 12, equal to the approved item and sub item (`sidebar/item-radius`); DSA-72 took this radius as an accepted exception. It stays as a deviation kept from the soft style, which asks 6 to 8 on an item. |
| 5. Focus of the approved pieces against the new piece | The item, the sub item and the rail button of the sidebar went to `focus/border` (DSA-72), the same border of the subgroup. `focus/border` measures 3.38 in light (Comercial) and 4.81 in dark. |
| 6. Color of the group line | `sidebar/group-line` (to `color/primary-surface`), as the line of the accepted `nph-sidebar`. In dark the line is a tone of the brand, not transparent white: a kept deviation from the soft style. |
| 7. Indent of the third level | The third level repeats the recipe of the second, with the line (plus 23). One rule for every level, the same line of the sidebar. |
| 8. Where the panel menu enters | In the place of the list of the expanded `nph-sidebar`. Collapsed and mobile follow the `nph-sidebar` (DSA-72). |
| 9. One open group at a time or several | Several open; opening one does not close the others. |
| 10. Answer to DSA-53 D-4 | The part of the sidebar, by the accepted Figma (DSA-72): the sub item with options opens the third level as a disclosure, in a panel at the side. The part of the panel menu: the subgroup opens the third level in place, and the sub item with options stays out of it (in the set `5608:168`, the 4 sub items have options = no). |
| 11. Binding of the gaps | The layers line → items of the second and third level bind to `panel-menu/nest-gap` → `core/space/300`, and the layer label → items of the section binds to `panel-menu/label-gap` → `space/stack-snug`. The pixel did not change. |

Kept deviations from the soft style, all inherited from an approved piece: focus with border of 1 and halo of 4 (the halo of 4 is foundation, and it is decoration; the border that meets 3:1 has 1); radius 12 of the item and sub item; side padding of 10 of the item; line of the group in dark as a tone of the brand.

## Outside this task

The `nph-sidebar` (DSA-72) binds the gap between the group line and the items of the second level to `space/control-padding`, and the gap between the section label and the items of the System group to `space/inline`. The panel menu binds the same distances to `core/space/300` (`panel-menu/nest-gap`) and to `space/stack-snug` (`panel-menu/label-gap`): the same pixel. Aligning the `nph-sidebar` to the panel menu is an open question, outside this task, and nothing was changed in the `nph-sidebar`.
