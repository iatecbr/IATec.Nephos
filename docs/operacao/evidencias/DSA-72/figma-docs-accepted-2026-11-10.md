```json
{
  "task": "DSA-72",
  "gate": "figma-docs-accepted",
  "date": "2026-11-10",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4633-27036",
    "date": "2026-11-09",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-sidebar documentation frame (4633:27036, page 1367:2), COMPONENT_SET nph-sidebar (4605:9647), with the Figma UX QA and the textual audit approved, and approved the points of the approval page: color/primary-text on the active item, the open group and the flyout title; the active rail button and the corner button on the color/primary and color/primary-foreground pair; sidebar/flyout-border on color/border-subtle; sidebar/scrim on overlay/scrim; sidebar/mobile-offset on core/space/200; focus/border on every focusable piece of the menu; the group label without uppercase, on text/heading-2xs; the open flyout option only with options; the sidebar icon in nph-icon; the radius exceptions, with the flyout panel at 12 like nph-dropdown-menu (decided on 2026-11-10); the token descriptions and the tokens Figma had and the code did not; the logo in dark confirmed by the brand before the code."
  }
}
```

# DSA-72 — `figma-docs-accepted`

The documentation of `nph-sidebar` (frame `4633:27036`) was accepted in Figma on 2026-11-09, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The sidebar enters the first version of Nephos. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- `sidebar/rail-background-active` and `sidebar/rail-foreground-active` now point to `color/primary` and `color/primary-foreground`, the pair of the nph-button primary solid. Before, they pointed to `color/primary-hover` and `color/primary-surface-hover`, and the icon of the active rail button and the label of the corner button stayed below 4.5:1 in dark in four brands (`Gerencial` 1.47, `Educação` 1.00, `Igrejas` 1.86, `Recursos Humanos` 1.56). Now they measure from 4.96 to 14.59:1.
- `sidebar/flyout-border` now points to `color/border-subtle`, the soft border of every floating layer (nph-popover, nph-hover-card, nph-dropdown-menu).
- New: `sidebar/scrim` (alias of `overlay/scrim`), the scrim behind the mobile menu, and `sidebar/mobile-offset`, straight to `core/space/200` (8) by decision: `space/inline` and `space/stack-snug` also measure 8, but they are the gap between side by side elements and between title and text, not a position.
- New: `sidebar/flyout-radius`, straight to `core/radius/500` (12) by decision, as `dropdown/panel-radius`: Indiane chose 12 for the flyout panel on 2026-11-10, the radius of nph-dropdown-menu and of the options inside the panel; `radius/container` is 8 and leaves the floating menus out, and `radius/surface` is 14 and belongs to card, panel and sheet.
- `sidebar/panel-width`, `sidebar/rail-padding`, `sidebar/logo-max-height` and `sidebar/logo-mark-size` existed in Figma and not in the code; they came now. `sidebar/panel-width` is an alias of `layout/sidebar-expanded` (256), the same role (rule T9, item 2). The other three go straight to core by decision, with their primitives `core/space/500` (20), `core/layout-height/sidebar-logo` (24) and `core/layout-height/sidebar-logo-mark` (32): `icon/size-md` is also 20 but is an icon size; `layout/gutter`, `space/overlay-padding` and `icon/size-lg` are also 24 but are gutter, layer padding and icon; `space/section` and `avatar/size-md` are also 32 but are section gap and avatar.
- `core/layout-width/sidebar-collapsed` and `core/layout-width/sidebar-expanded` now have the Figma values, 80 and 256. The code had 64 and 280.
- `sidebar/item-foreground-active`, `sidebar/item-foreground-open` and `sidebar/flyout-title` already pointed to `color/primary-text` (`theme/brand-700` in light, `theme/brand-text-dark` in dark), which meets 4.5:1 in the seven brands in both modes. No new semantic token.

The `use` of five semantic tokens in `design.md` now names nph-sidebar where the accepted Figma uses them: `color/primary`, `color/border-subtle`, `color/primary-text`, `focus/border` and `overlay/scrim`.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks (`modo`, `expandido`, `recolhido`, `móvel`, `estado`, `pronto`, `carregando`, `botão de recolher`, `botão do canto`, `opções`, `sim`, `não`, `repouso`, `hover`, `foco`, `ativo`, `aberto`, `desabilitado`, `tipo`, `grupo`, `painel`, `rótulo`, `título`).

## Purpose

The main navigation of a product, in a column on the left, in view on a wide screen (on a phone, it opens over the screen), so that the person knows where they are and changes area with one click. The list goes to the second level (item and subitem); the third level opens in a flyout panel next to whoever opened it. In the collapsed mode, an item with children opens a flyout panel next to its rail button, with the item name as the title. The menu shows where the person is; the product decides the current item and the mode. The account of the person is not in the menu: it is in the product header.

It does not replace the tabs inside a page (nph-tabs), the action menu of a button (nph-dropdown-menu), the top navigation (nph-navigation-menu) or the page trail (nph-breadcrumb).

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-sidebar` | `4605:9647` | The menu. `modo` (`expandido`, `recolhido`, `móvel`) × `estado` (`pronto`, `carregando`); booleans `botão de recolher` and `botão do canto`, both on by default. |
| `nph-sidebar-flyout` | `4605:9612` | The flyout panel, the same for the second level of the collapsed menu and for the third level. Its title comes from the nested label (`nph-sidebar-label`, `tipo=painel`, property `rótulo`), exposed on the panel instance. |
| `nph-sidebar-flyout-option` | `4605:9599` | An option of the flyout panel. `estado` (`repouso`, `hover`, `foco`, `ativo`, `desabilitado`, `aberto`) × `opções` (`sim` shows the chevron-right arrow at the end and opens the third level; `não`, no arrow). `aberto` exists only with `opções=sim`. |
| `nph-sidebar-logo` | `4605:9589` | The product logo: full in the expanded and mobile modes, mark in the collapsed mode. |
| `nph-sidebar-label` | `4605:9594` | The label above a group (`tipo=grupo`) and the flyout title (`tipo=painel`), on `text/heading-2xs`, without uppercase. |

The item, subitem and rail button are nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button (DSA-53), used by instance. The search is nph-input, the collapse and close buttons are nph-icon-button, the corner button is nph-button, and the loading list is nph-skeleton.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `sidebar/panel-background` | `color/primary-surface-hover` | Background of the menu, expanded and collapsed |
| `sidebar/panel-border` | `theme/brand-200` in light, `theme/brand-700` in dark | 1 px border of the menu |
| `sidebar/panel-width` | `layout/sidebar-expanded` (256) | Width of the expanded and mobile menu |
| `sidebar/panel-radius` | `core/radius/900` (24) | Corners of the expanded menu |
| `sidebar/rail-radius` | `core/radius/off-scale/18` | Corners of the collapsed menu |
| `sidebar/panel-spacing` | `core/space/600` (24) | Side padding of the expanded menu and gap between top, middle and foot |
| `sidebar/rail-padding` | `core/space/500` (20) | Side padding of the collapsed menu |
| `sidebar/section-gap` | `space/stack` | Gap between the search, the separator and the navigation |
| `sidebar/separator` | `color/primary-surface` | The one line between areas: between the search and the navigation |
| `sidebar/search-background` | `color/primary-surface` | Background of the search |
| `sidebar/search-border` | `theme/brand-200` in light, `theme/brand-700` in dark | Border of the search |
| `sidebar/logo-max-height` | `core/layout-height/sidebar-logo` (24) | Maximum height of the logo area; the maximum width is the inner width of the menu |
| `sidebar/logo-mark-size` | `core/layout-height/sidebar-logo-mark` (32) | Maximum side of the logo mark in the collapsed menu |
| `sidebar/group-label` | `core/surface/700` in light, `core/surface/100` in dark | Group label |
| `sidebar/rail-background-active` | `color/primary` | Background of the active rail button and of the corner button |
| `sidebar/rail-foreground-active` | `color/primary-foreground` | Icon of the active rail button and label of the corner button |
| `sidebar/flyout-background` | `color/background` | Background of the flyout panel |
| `sidebar/flyout-border` | `color/border-subtle` | 1 px border of the flyout panel |
| `sidebar/flyout-radius` | `core/radius/500` (12) | Corners of the flyout panel, the same as nph-dropdown-menu |
| `sidebar/flyout-title` | `color/primary-text` | Flyout title |
| `sidebar/flyout-foreground` | `color/foreground` | Label and arrow of a flyout option |
| `sidebar/flyout-option-hover` | `color/primary-surface` | Background of a flyout option on hover |
| `sidebar/item-foreground-active` | `color/primary-text` | Label of the active flyout option (and of the active item and subitem) |
| `sidebar/item-foreground-open` | `color/primary-text` | Label of the open flyout option (and of the open group) |
| `sidebar/item-padding` | `core/space/off-scale/10` | Inner padding of a flyout option |
| `sidebar/item-radius` | `core/radius/500` (12) | Corners of a flyout option |
| `sidebar/scrim` | `overlay/scrim` | Scrim behind the mobile menu, drawn by the screen, outside the component |
| `sidebar/mobile-offset` | `core/space/200` (8) | Distance from the mobile menu to the screen edge |
| `layout/sidebar-collapsed` | `core/layout-width/sidebar-collapsed` (80) | Width of the collapsed menu in the application shell |
| `focus/border` | semantic | 1 px focus border of every focusable piece of the menu |
| `focus/halo`, `focus/ring-width`, `focus/border-radius-sidebar-item`, `focus/radius-sidebar-item` | semantic | Focus halo and its corners |
| `state/disabled-opacity` | semantic | Disabled flyout option (50) |
| `space/section` | semantic | Top and bottom padding of the menu |
| `control/height-default` | semantic | Height of a flyout option, the search, the collapse button and the corner button (36). Used directly, with no `sidebar/*` token: it is the height of every control of the design system, and `sidebar/item-height` (40) belongs to the item and the rail button only |
| `icon/size-md` | semantic | Icon of the collapse button (20) |

The flyout panel uses the effect style `elevation/dropdown`, the same as nph-dropdown-menu. The expanded and collapsed menus have no shadow. The item, subitem and rail button keep the `sidebar/item-*`, `sidebar/group-line`, `sidebar/rail-background-hover`, `sidebar/rail-button-size`, `sidebar/item-badge-*` and `sidebar/item-height` tokens of DSA-53; the menu does not override them.

## Anatomy

Order from top to bottom; the parts are centered on the width of the menu except where said. The alignments are read from the component sets; the Figma documentation does not write them.

1. **Panel** — background `sidebar/panel-background`, 1 px border `sidebar/panel-border`, corners `sidebar/panel-radius` (collapsed: `sidebar/rail-radius`). It floats, with no shadow.
2. **Logo** — nph-sidebar-logo at the top start: full in the expanded and mobile modes, mark in the collapsed mode. It only marks the product; it is a link with the product name.
3. **Collapse button** — nph-icon-button primary ghost, at the end of the logo row, aligned to the logo center; in the collapsed mode, below the mark. The icon is `sidebar` (Font Awesome, light), one for both states, with the state in `aria-label` and `aria-expanded`. Until it enters nph-icon, Figma shows a skeleton of 20 × 20 (`icon/size-md`) in its place (see D-1). In the mobile mode, the same place holds the close button (`xmark`).
4. **Search** — nph-input, background `sidebar/search-background`, border `sidebar/search-border`. Only in the expanded and mobile modes.
5. **Separator** — 1 px in `sidebar/separator`, between the search and the navigation. The only line between areas.
6. **Navigation** — items, subitems and, in the collapsed mode, rail buttons, with an optional counter. The only part that scrolls: top and foot stay fixed.
7. **Group label** — nph-sidebar-label `tipo=grupo`, above the items of a group, aligned to the item start.
8. **Corner button (optional)** — the main action of the product, such as All applications: nph-button primary solid, with no icon; in the collapsed mode, nph-icon-button primary solid with `plus` light. At the foot. The collapsed icon button needs an `aria-label` that repeats the expanded label *(not in Figma; code decides the text)*.

Spacing: `sidebar/panel-spacing` on the sides (collapsed: `sidebar/rail-padding`) and between top, middle and foot; `space/section` at top and bottom; `sidebar/section-gap` between the search, the separator and the navigation.

## Properties

| Field | Rule |
|---|---|
| `modo` | `expandido`: width `sidebar/panel-width`, full logo, search and names. `recolhido`: width `layout/sidebar-collapsed`, logo mark, collapse button, rail buttons with a tooltip and the corner button as an icon; no search. `móvel`: the expanded menu over the screen, with the close button in place of the collapse button. |
| `estado` | `pronto`: the list of the product. `carregando`: nph-skeleton in place of the items; logo, search and corner button stay. |
| `botão de recolher` | On by default. Shows the collapse button. |
| `botão do canto` | On by default. The main action of the product at the foot. |
| Not a property | Items, subitems, counter, active and disabled come from the nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button instances. The flyout panel is nph-sidebar-flyout; its title is the name of whoever opened it. The mobile scrim belongs to the screen. Scrolling of the navigation is done in the code. |

## Behavior

Base: WAI-ARIA APG, Disclosure Navigation Menu example; the mobile mode follows the Dialog (Modal) pattern. A rule marked *(APG default, not in Figma)* is not written in the Figma documentation: it is the default of the pattern named after it, brought here so that the code does not have to guess. A rule marked *(code decides)* is left to the code, within the pattern.

| Input | What it does |
|---|---|
| Tab and Shift+Tab | Move through the logo link, the collapse button, the search, each item, subitem or rail button, and the corner button, in reading order. The navigation is not one single Tab stop. *(APG default, not in Figma: Disclosure Navigation Menu, keyboard support.)* Arrow keys between items are optional in the pattern *(code decides)*. |
| Enter or Space on an item with children | Opens or closes its group (expanded) or its flyout panel (collapsed), with `aria-expanded` and `aria-controls`. *(APG default, not in Figma: Disclosure Navigation Menu.)* |
| Enter or Space on a flyout option with options | Opens the third level next to the option. *(APG default, not in Figma: Disclosure Navigation Menu.)* |
| Esc | Closes the open flyout panel and returns the focus to whoever opened it (Figma, Accessibility, accessible name). In the mobile mode, with no flyout open, closes the menu and returns the focus to the button that opened it. *(Mobile part: APG default, not in Figma: Dialog (Modal).)* |
| Click outside | Closes the open flyout panel. In the mobile mode, a click on the scrim closes the menu. *(APG default, not in Figma: the Disclosure Navigation Menu example closes an open panel when the focus or the click leaves it.)* |
| Hover | In the collapsed mode, hover does not open the flyout panel: only a click, Enter or Space opens it. Hover shows the rail button tooltip. *(APG default, not in Figma: a disclosure opens on activation.)* |
| Focus on open | Opening a flyout panel keeps the focus on whoever opened it; the next Tab enters the panel. *(APG default, not in Figma: Disclosure Navigation Menu.)* |
| Several panels | Opening another flyout panel at the same level closes the one already open. Esc closes only the innermost open panel and returns the focus to its opener. *(APG default, not in Figma.)* |
| Near the screen edge | When the panel does not fit next to its opener, it moves to stay inside the screen, keeping the 8 px distance. *(Common practice, not in Figma: Radix UI `avoidCollisions` and `collisionPadding`.)* |
| Tooltip and panel | Opening a flyout panel closes the tooltip of its opener. *(Not in Figma: a tooltip does not cover an open panel.)* |
| Loading | `estado=carregando` marks the navigation with `aria-busy="true"`; the number of skeleton rows *(code decides)*. |
| Collapse button | Switches between `expandido` and `recolhido`. Who keeps the chosen mode, and a keyboard shortcut, are open points of the task. |
| Mobile | The product chooses the mode: it switches to `móvel` below 768 px *(not in Figma: `breakpoint/md`, design.md)* and opens the menu with a button of its own, which gets the focus back on close (the open property and its event are named by the code). Below 768 px the expanded menu opens over the screen, `sidebar/mobile-offset` from the edge, with the `sidebar/scrim` scrim behind; the focus is trapped inside while it is open *(APG default, not in Figma: Dialog (Modal))*; the close button (`xmark`) closes it. |
| Flyout position | Next to whoever opened it, 8 px to the side, with its top aligned to the top of the opener. |
| Scrolling | Top and foot stay fixed and only the navigation scrolls, so that the focused item is never hidden behind them (WCAG 2.4.11); the middle only clips what goes past the height. The focused item scrolls into view *(not in Figma: WCAG 2.4.11)*. |
| Motion | Collapse and expand use `motion/expand-duration` and `motion/expand-easing`; the mobile menu enters with `motion/enter-*` and leaves with `motion/exit-*`. With reduced motion, the change happens without animation (as DSA-62 D-3). |

Combined states (rule T11 of the design system; not drawn in Figma, the flyout option set has one state per variant): a flyout option active + open keeps the active look (brand color, Medium weight) and the arrow; active + disabled keeps the active look under `state/disabled-opacity`; active + hover keeps the active look with the hover background.

Inherited decisions: a rail button tooltip and a cut label follow DSA-48: nph-tooltip after `motion/hover-delay` on hover, at once on keyboard focus with no wait (D1), and a click during the wait cancels it (D2). Reduced motion follows DSA-62 D-3.

DSA-53 left four points open for the item, subitem and rail button. The accepted Figma answers them:

| DSA-53 point | Answer from the accepted Figma |
|---|---|
| D-1, where the rail button counter sits | Absolute, on the top end corner of the button: on a 40 px button, at x 19 and y -4. |
| D-2, width of the outline of the active rail button counter | 4 px, in `sidebar/panel-background`. Not `border/width`. Figma binds the width to `focus/ring-width`, but the outline is decorative, not focus: the code does not tie it to the focus ring. |
| D-3, severity of more actions | nph-icon-button `secondary`, ghost, compact. Not primary. |
| D-4, what a subitem with `opções=sim` opens | It opens the third level in a flyout panel next to it. It is a disclosure button with `aria-expanded` and `aria-controls`, not a link. |

The code of nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button changes where these answers differ from what DSA-53 shipped (D-2, D-3 and D-4).

Limits:

| Case | Rule |
|---|---|
| Minimum | *(Not in Figma; code decides.)* One item: the menu keeps logo, navigation and foot; the separator stays. |
| Maximum | Two levels in the list; the third level only in a flyout panel. No fourth level. |
| Long text | The label is cut with an ellipsis and the whole name goes to nph-tooltip, after the wait on hover and at once on keyboard focus (DSA-48). |
| Empty | *(Not in Figma; code decides.)* No items: a short message in place of the list. Without permission, the item does not appear. Error: a short message in place of the list. Who provides and translates the messages is an open point of the task. |
| Many items | *(Not in Figma; follows the scrolling rule.)* Only the navigation scrolls; top and foot stay. |
| Short window | *(Not in Figma; follows the scrolling rule.)* The same: the navigation scrolls between the fixed top and foot. |

Icon and image: every icon is nph-icon. Item and rail button icons follow DSA-53 (light at rest, solid when active, at `icon/size-md`); the flyout option arrow is `chevron-right`; the close button uses `xmark`; the collapse button uses `sidebar` light (D-1); the collapsed corner icon button uses `plus` light, and the expanded corner button has no icon. The logo is an image from the brand library, not exported by Nephos; its dark version waits for the brand (D-2).

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Accessibility

| Criterion | Rule |
|---|---|
| contrast | In every brand, every text of the menu meets 4.5:1 on its background, in light and dark. In the `Sistemas` theme, the lowest values measured are 5.30:1 in light and 5.84:1 in dark. Brand-colored text follows the color per brand row below. |
| visible focus | `focus/border` on every focusable piece of the menu: item, subitem, rail button, flyout option, collapse and close buttons. Against the panel it measures at least 3.38:1 in light and 4.81:1 in dark; against the flyout panel, 4.32:1 in light and 4.91:1 in dark, in every brand. The border meets 3:1; the halo is decoration. Before, the border of the item, subitem, rail button and collapse button was `color/primary`, below 3:1 in dark in `Gerencial` (2.66), `Educação` (1.76) and `Recursos Humanos` (2.76) (measured in the Figma UX QA; not written in the documentation). The corner button keeps the default focus of nph-button. |
| color is not the only sign | The active item uses the brand color, Medium weight and a solid icon; the active subitem and flyout option use the brand color and Medium weight; the active rail button turns its icon solid. The open flyout option uses the same color, Regular weight and the arrow: the weight separates active from open. |
| color per brand | The active item, the open group, the flyout title and the active option use `color/primary-text`. The corner button and the active rail button use `color/primary` with `color/primary-foreground`. In dark, in some brands, the background of the active rail button stays below 3:1 against the panel; there the solid icon marks it. |
| target size | Item and rail button at 40 (`sidebar/item-height`, `sidebar/rail-button-size`); subitem, flyout option, search, collapse button and corner button at `control/height-default` (36). All above 24 × 24. |
| accessible name | The menu is a navigation landmark with a name (`aria-label`, for example "Main menu"). The collapse button carries `aria-label` ("Collapse menu" or "Expand menu") and `aria-expanded`. In the collapsed mode, each rail button carries the item name in `aria-label` and in the tooltip. The current item carries `aria-current="page"`. Whoever opens a flyout carries `aria-expanded` and `aria-controls`. The logo is a link with the product name. A counter number goes into the name ("Inbox, 12 new") *(not in Figma: accessible name, WAI-ARIA APG, Providing Accessible Names)*. |

## Relations and context

| With | Rule |
|---|---|
| Items and subitems | nph-sidebar-item, nph-sidebar-subitem and nph-sidebar-rail-button, by instance. Their colors come from the `sidebar/item-*` tokens; the menu does not override them. |
| Flyout panel | nph-sidebar-flyout opens next to whoever opened it: in the collapsed mode, next to the rail button (second level); then next to the option or the subitem (third level). The options are nph-sidebar-flyout-option. The panel: padding `sidebar/item-padding` on the sides and `space/inline` on top and bottom, gap `space/inline-tight`; width fixed at 220 px in Figma, with no token *(code decides the limits)*. The close button follows the collapse button: `focus/border`. |
| Who controls | The product chooses the mode, the current item and what opens; the menu only shows. |
| Screen | In the mobile mode, the menu floats over the screen with the scrim behind; the scrim belongs to the screen. The account of the person (avatar, name, e-mail) is in the product header, on the right. |

## When to use

| Situation | Choice |
|---|---|
| Wide screen, and the area names help to choose | `modo=expandido` |
| The content needs width (table, editor) | `modo=recolhido`: the rail shows the icons with a tooltip; an item with children opens the flyout next to it |
| Narrow screen, such as a phone | `modo=móvel`: opens over the screen with the scrim, closes with the close button |
| The list is still arriving | `estado=carregando` in place of the list |
| The area has child screens and the menu is collapsed | The item opens the flyout with its name as the title; an option with children shows the arrow and opens the third level next to it |
| The product has no main action | Turn off the corner button |

## Required examples

Product with many areas (expanded, corner button at the foot); list arriving (expanded, loading); phone (mobile over the screen, with the scrim); collapsed with the flyout next to the rail button and the third level next to the option. Each in light and dark.

## Do

| Do | Why |
|---|---|
| Let only the navigation scroll; top and foot stay fixed | Logo, search and corner button stay at hand, and the focus does not hide behind them |
| Open the flyout next to whoever opened it, top aligned, with its name as the title | The person keeps the reference of where they clicked |
| Use the loading state in place of the list while it arrives | The menu does not jump when the items appear |
| Separate areas by space; the line only between the search and the navigation | A light menu, with no divider on every row |
| Show the current item with color, Medium weight and a solid icon; in the collapsed mode, with the solid icon and the button background | Color alone is not enough, and it changes with the brand |

## Do not

| Do not | Use instead |
|---|---|
| Put a page action in the corner button (save, filter, export) | nph-button in the page bar; the corner button is the main action of the product |
| Use the collapsed mode on a phone | The mobile mode, over the screen, closed by the close button |
| Open the flyout far from whoever opened it | The flyout next to the item, top aligned, with its name as the title |

## Appendix points answered

| Point | Answer |
|---|---|
| Active, open and flyout title in dark | `color/primary-text`, already on `v/5.0.0`. Before, `color/primary-hover` stayed below 4.5:1 in four brands. |
| Active rail button and corner button | The pair of nph-button primary solid, `color/primary` and `color/primary-foreground`; the corner button has no override. |
| Flyout border | `sidebar/flyout-border` on `color/border-subtle`. |
| Mobile scrim | `sidebar/scrim` on `overlay/scrim`; the screen draws it. Check its strength in dark in the code: nph-drawer is out of the first version. |
| Mobile distance | `sidebar/mobile-offset` on `core/space/200` (8). The flyout distance (8 to the side, top aligned) is a position the code sets from the opener, with no layout token. |
| Focus of the item, subitem, rail button, collapse and close buttons | `focus/border`, as the flyout option. The nph-icon-button set keeps its own focus elsewhere; inside the sidebar, the focus border of the collapse and close buttons is `focus/border`, through a focus hook of nph-button (see the task). The corner button keeps the default focus of nph-button; the search already uses `focus/border` in nph-input. |
| Group and flyout label | No uppercase, on `text/heading-2xs`. |
| Open flyout option without options | Removed: `aberto` exists only with `opções=sim`. |
| Flyout title property | The title comes from the nested label, exposed on the panel instance; the code offers it as a title property of the flyout. |
| Radius exceptions | Item 12, menu 24 and rail 18 stay (pieces already in the code). The flyout panel uses `sidebar/flyout-radius` (12), the radius of nph-dropdown-menu (`dropdown/panel-radius`), by decision of Indiane on 2026-11-10. |
| Dark border of the menu | `theme/brand-700` stays. |
| Group collapsible by its label | Out of the first version. |
| Complementary area | Out of the first version. |
| Surface | Floating only; attached to the edge and inset are out of the first version. |
| Counter of the active rail button | The number stays readable (at least 7.99:1); the outline in `sidebar/panel-background` separates the counter from the button (1.76 to 9.91:1). In dark, in four brands, the counter background is close to the panel color on every item; the number and its accessible name carry the information. |
| Disabled subitem and rail button | `state/disabled-opacity` on the whole piece; no hover, no focus. |
| Rail button tooltip | On by default in the collapsed mode, with the item name; the same name in `aria-label`. |
