```json
{
  "task": "DSA-83",
  "gate": "figma-docs-accepted",
  "date": "2026-11-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6432-8686",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-menubar root (6410:7413) and accepted its documentation frame (6432:8686, page 1626:15), with COMPONENT_SET nph-menubar (6410:7769) and COMPONENT_SET nph-menubar top item (6402:4299). In the same approval round she answered the 8 open items as recommended, none rejected: (1) documentation and root accepted; (2) top item in hover and open on menubar/trigger-background-hover (color/primary-surface-hover) with the label in menubar/trigger-foreground-hover (color/primary-on-surface-hover), lowest 6.43:1, instead of the black text of her correction print, and the description of color/primary-surface-hover now names color/primary-on-surface-hover on top; (3) the focus border of the nph-dropdown-menu item moves from color/primary to focus/border, also in the nph-context-menu; (4) in Figma the submenu arrow of the item in focus is now solid, as the code; the solid layer following the start icon swap goes to the next round, nothing for code; (5) new token dropdown/submenu-offset to core/space/100 (4), used by nph-context-menu and nph-menubar; (6) narrow screen: a button with the bars icon opens one nph-dropdown-menu with the menus as submenus, in one level, not following DSA-62 D-1, mobile out of v1; (7) collision padding to the window edge 4 px (core/space/100), code only, no token; (8) design rule: a bar trigger open or in hover uses the primary palette, not gray, only for bars. The 8 menubar/* tokens alias existing semantics, except menubar/panel-offset, straight to core/space/100 by decision. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-83 — `figma-docs-accepted`

The documentation of the nph-menubar (frame `6432:8686`, page `1626:15`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6410:7413`. It is a horizontal bar of command menus of an application, such as File, Edit and View. Each top item opens a panel, which is an instance of the nph-dropdown-menu, with the commands of that subject. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `menubar/*`, 8 tokens in the semantic collection. Seven alias existing semantics; `menubar/panel-offset` points straight to `core/space/100` by decision (rule 3 of T9), as `navigation-menu/panel-offset` and `popover/offset`, because no semantic names the distance to a floating layer and `space/inline-tight`, also 4, says DO NOT USE between independent elements.
- New token `dropdown/submenu-offset` → `core/space/100` (4), straight to core by the same decision, with a new entry in `design.md`. It is the gap between a panel and the submenu open beside it, in the nph-context-menu and the nph-menubar.
- No new value entered the core (rule T9).
- Extended `use` in `design.md`: `color/foreground`, `color/primary-surface-hover`, `color/primary-on-surface-hover`, `focus/border`, `space/inline`, `space/control-padding`, `control/height-default` and `radius/control`. The description of `color/primary-surface-hover` now names `color/primary-on-surface-hover` on top: the old pair, `color/primary-on-surface`, measures 4.26:1 on it (light, `Sistemas`) and 4.36:1 (light, `Educação`), below 4.5:1.
- Left without a component token: the panel is an nph-dropdown-menu instance and keeps the tokens of that piece; the focus, the disabled opacity and the text style of the top item are system values used directly (see "Used directly").

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks.

## Purpose

A horizontal bar of command menus of an application, such as File, Edit and View. Each top item opens a panel with the commands of that subject.

Use it in the header of an application with many commands that group by subject: a document editor, a spreadsheet, a drawing tool. The bar stays in view; each panel opens by click or by keyboard.

It does not replace the nph-navigation-menu nor the nph-sidebar, which lead to other pages. It does not replace the nph-toolbar, which keeps the frequent actions in view, nor the nph-dropdown-menu alone, which opens from a button: the menubar uses the nph-dropdown-menu as its panel.

Selection in Figma: `aberto` (`não` or `sim`) on the bar; `state` and `rótulo` on the top item. The panel is an instance of the nph-dropdown-menu, and its items are chosen on the instance: type, selection, shortcut, icon and submenu.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-menubar | `6410:7769` | `aberto` (`não` default, `sim`). 2 variants: `aberto=não` (`6410:7415`) is the bar alone; `aberto=sim` (`6410:7424`) is the bar with the 1st top item in `hover-aberto` and the nph-dropdown-menu panel below. |
| `nph-menubar / item de topo` | `6402:4299` | `state` (`default` default, `hover-aberto`, `foco`, `disabled`) and the text property `rótulo` (default `"Arquivo"`). 4 variants: `6402:4300`, `6402:4302`, `6402:4304`, `6402:4308`. |
| nph-dropdown-menu item (used, not changed in Figma by this component) | `1365:57` | The item of the panel. Its 6 focus variants now draw the border in `focus/border` (decided, see "Decisions answered"). |

The root is `6410:7413`. The matrix of the variants is the `Matriz — nph-menubar` section of the documentation frame, in light and dark: the bar closed and open, and the 4 states of the top item.

## Tokens

Values in the default brand, `Sistemas`, where the token is a brand color.

| Token | Points to (light \| dark) | Where it is used |
|---|---|---|
| `menubar/bar-gap` | `space/inline` (8) | Gap between the top items of the bar. Its description names "items of a bar"; the nph-navigation-menu keeps its own `navigation-menu/bar-gap` (4). |
| `menubar/trigger-height` | `control/height-default` (36) | Height of the top item. |
| `menubar/trigger-padding-x` | `space/control-padding` (12) | Padding on each side of the top item; the width hugs the label. |
| `menubar/trigger-radius` | `radius/control` (6) | The 4 corners of the top item. |
| `menubar/trigger-foreground` | `color/foreground` (#000000 \| #E3E3E3) | Label of the top item at rest, in focus and disabled. |
| `menubar/trigger-background-hover` | `color/primary-surface-hover` (#D8E6FD \| #183462) | Background of the top item in hover and open (decided). |
| `menubar/trigger-foreground-hover` | `color/primary-on-surface-hover` (#234E94 \| #D8E6FD) | Label of the top item in hover and open (decided). |
| `menubar/panel-offset` | `core/space/100` (4) | Gap between the bar and the open panel (decided, rule 3). |
| `dropdown/submenu-offset` | `core/space/100` (4) | Gap between the panel and the submenu open beside it, in the nph-context-menu and the nph-menubar (decided, rule 3). In Figma the submenu sits at that distance by position, in frames without auto layout, so no binding is possible there. |

Deviation declared (a token bound to a semantic of another function because of a sibling): none. Each token points by the description of its function; the approved sibling is only a precedent (`toolbar/gap`; `collapsible/trigger-height` and `tabs/button-height`; `navigation-menu/trigger-padding-x`, `navigation-menu/trigger-radius` and `navigation-menu/trigger-foreground`; `scheduler/event-background-hover` and `scheduler/event-foreground-hover`; `navigation-menu/panel-offset` and `popover/offset`).

## Anatomy

Order of the parts: in the bar, from left to right; in the panel, from top to bottom. Read layer by layer in the 6 variants of `6402:4299` and `6410:7769`:

| Part | Kind | Layout | Tokens and text style |
|---|---|---|---|
| 1 · Bar (`aberto=não`, and the `barra` frame inside `aberto=sim`) | frame of the variant (290 × 36 with the 4 example labels) | horizontal, no padding, gap 8, top items vertically centered, starting at the start of the header where the bar lives | gap `menubar/bar-gap`; no background and no stroke of its own |
| Open variant (`aberto=sim`) | frame of the variant (290 × 212) | vertical, no padding, gap 4: the bar on top, the panel below | gap `menubar/panel-offset` |
| 2 · Top item (`state=*`) | frame of the variant (77 × 36 with "File") | horizontal, padding 0 top and bottom and 12 on each side, gap 0; the width hugs the label, the label centered in the item | height `menubar/trigger-height`, padding `menubar/trigger-padding-x`, 4 corners `menubar/trigger-radius`; background only in `hover-aberto`: `menubar/trigger-background-hover`; `disabled`: opacity `state/disabled-opacity` on the whole item |
| Label (`rótulo`) | text (53 × 20 with "File") | — | text style `text/label-md` (`core/font/sans`, `core/size/200`, `core/weight/medium`, `core/line-height/200`, `core/tracking/normal`); color `menubar/trigger-foreground` in `default`, `foco` and `disabled`, `menubar/trigger-foreground-hover` in `hover-aberto` |
| Focus border (`borda de foco`, only in `foco`) | frame outside the item (79 × 38) | — | stroke `focus/border` in `border/width`, corners `focus/border-radius-control`; no background |
| Focus halo (`halo de foco`, only in `foco`) | frame outside the border (87 × 46) | — | stroke `focus/halo` in `focus/ring-width`, corners `focus/radius-control-with-border` |
| 3 · Panel (`painel — nph-dropdown-menu`) | instance of `nph-dropdown-menu`, profile header off (`cabeçalho` = false), 280 × 172 | below the bar, aligned with the start of the open top item, 4 from the bar | the menubar binds none of its tokens. It brings: fill `color/popover`, stroke `color/dropdown-border` in `border/width`, 4 corners `dropdown/panel-radius` (12), padding `space/inline-tight` (4) on all sides, width `layout/input-width` (280, default width, no new token), effect style `elevation/dropdown` |
| 4 · Menu item | rows of the instance (`nph-dropdown-menu / item`), 36 high in the default size | icon at the start, label, shortcut at the end, vertically centered | its own tokens: `dropdown/item-radius` (8), `color/popover-foreground`, hover `color/primary-surface`, `dropdown/item-destructive-foreground`, start icon `icon/size-md`, submenu arrow and check `icon/size-sm` |
| 5 · Separator | `nph-dropdown-menu / separador` of the instance | between groups of commands, aligned with the start and the end of the panel, at its width | its own token `dropdown/separator` |
| 6 · Shortcut | text of the item | aligned with the end of the item | `color/muted-foreground`, from the piece |
| 7 · Submenu | a 2nd panel, another instance of the nph-dropdown-menu | to the right of the panel, aligned by the top with the parent item, 4 from the panel, one level | gap `dropdown/submenu-offset` (in Figma by position) |

The shell of the top item set (`6402:4299`) has the background `color/background`, inherited from the old set `5043:287`; it is the Figma canvas of the set, not part of the component. The shell of the nph-menubar set has no background nor radius.

## Properties and states

| Field | Rule |
|---|---|
| `aberto` | On the bar (nph-menubar). `não`: no panel open. `sim`: the 1st top item in `hover-aberto` and the nph-dropdown-menu panel below. Default: `não`. |
| `state` | On the top item: `default`, `hover-aberto` (pointer over it or menu open), `foco` (keyboard) and `disabled`. Default: `default`. |
| `rótulo` | On the top item. Short text, preferably one word. Default: `"Arquivo"` (File). In the set, the width hugs the text, with 12 on each side. |
| panel | Not a property of the bar. The panel is an instance of the nph-dropdown-menu, with the profile header off. The rows are set on the instance: type, selection, shortcut, icon and submenu of each item; a row left over is hidden. Today the piece has four item slots, in a fixed order; the code builds the whole list. |
| submenu | Not an axis. The item with `submenu` on opens a 2nd panel, another instance of the nph-dropdown-menu, beside it, in one level. |
| size | There is no size axis: the top item is 36 high. |
| disabled bar | Not a property. Each top item has its own `disabled`. A bar that does not apply on that screen leaves the screen, instead of staying locked. |

States of the top item:

| State | Background | Label | Other |
|---|---|---|---|
| `default` | none | `menubar/trigger-foreground` | — |
| `hover-aberto` (pointer over it, or its menu open) | `menubar/trigger-background-hover` | `menubar/trigger-foreground-hover` | — |
| `foco` (keyboard) | none | `menubar/trigger-foreground` | border `focus/border` in `border/width` and halo `focus/halo` in `focus/ring-width` |
| `disabled` | none | `menubar/trigger-foreground` | `state/disabled-opacity` on the whole item |

## Content

| Place | Text in Figma | In prose |
|---|---|---|
| top items of the examples | `"Arquivo"`, `"Editar"`, `"Exibir"`, `"Ajuda"` | File, Edit, View, Help |
| long label (the width hugs the label) | `"Configurações avançadas"` | Advanced settings |
| File panel | `"Novo"` `Ctrl+N`, `"Abrir"` `Ctrl+O`, `"Recentes"` (with submenu), `"Excluir"` `Del` (destructive) | New, Open, Recent, Delete |
| Recent submenu (files opened a short while ago) | `"relatorio-anual.pdf"`, `"orcamento-2026.xlsx"`, `"ata-reuniao.docx"` | file names |
| View panel | group label `"Mostrar"`; checkboxes `"Régua"` and `"Grade"`; radios `"Confortável"` and `"Compacta"` | Show; Ruler, Grid; Comfortable, Compact |
| accessible name of the bar (example) | `"Menu do editor"` | Editor menu |
| accessible name of the radio group (example) | `"Densidade"` | Density |
| overflow top item | `"Mais"` | More |
| error example, top items that lead to pages | `"Início"`, `"Clientes"`, `"Relatórios"`, `"Ajustes"` | Home, Customers, Reports, Settings |
| error example, a 3rd panel | `"versão 3"`, `"versão 2"`, `"versão 1"` | version 3, 2, 1 |

The texts come in already translated; how is a point open for the code (see the last section).

## Accessibility and contrast

| Criterion | Rule |
|---|---|
| contrast | The label of the top item passes 4.5:1 in both themes: `menubar/trigger-foreground` (`color/foreground`) on `color/background` at rest and, in hover or open, `menubar/trigger-foreground-hover` (`color/primary-on-surface-hover`) on `menubar/trigger-background-hover` (`color/primary-surface-hover`), with the lowest at 6.43:1 across the 7 brands and the 2 themes. The text of the panel comes from the nph-dropdown-menu; the lowest across the 7 brands is 5.2:1 (checked radio, Financeiro, dark). A disabled item is outside the rule (WCAG 1.4.3). |
| visible focus | The top item in focus shows the border `focus/border` (`border/width`) with the halo `focus/halo`, without background. The border passes 3:1 on `color/background` in the 7 brands (lowest: 4.32:1, light, Comercial); the halo is decoration. The panel item uses the focus of the nph-dropdown-menu, with the border `focus/border`, which passes 3:1 on `color/popover` in the 7 brands and the 2 themes (Gerencial, dark: 5.53:1). |
| color is not the only signal | The open top item has the open panel below it, besides the background. A checked checkbox shows the check in the box; a checked radio shows the check at the end of the item. The destructive item carries the trash icon along with the color. |
| target | Top item 36 high and panel item 36 high in the default size, above the 24 px of WCAG 2.5.8. |
| keyboard | Tab enters the bar on the active top item and leaves it. Left and Right Arrow move between the top items. Enter, Space or Down Arrow opens the menu and focuses the 1st item. Esc closes the menu and returns focus to the top item; with a submenu open, the 1st Esc closes the submenu. The full keyboard, focus and pointer behavior follows the WAI-ARIA APG menubar pattern (table below). |
| accessible name | The bar carries a name with the subject of the area (e.g. "Editor menu", `"Menu do editor"`), and so does the radio group (e.g. "Density", `"Densidade"`), as the APG asks. Each item is read by its label. The icon is decoration. The code announces the shortcut (`aria-keyshortcuts`). |

The usage examples of the frame: the top item in focus, with the `focus/border` border and no background; opened by keyboard, focus goes to the 1st item of the panel.

## Default behavior

Base: the WAI-ARIA APG menubar pattern. Where the Radix Menubar default differs, the line says that the code adjusts to the APG. Research of the appendix, with the sources at the end of this file.

| Key or situation | What it does |
|---|---|
| Tab and Shift+Tab | One single stop in the bar: Tab enters by the top item used last (the first time, the 1st) and leaves the bar. With a menu open, Tab closes the menus and leaves. Radix traps Tab in the panel: the code adjusts to the APG. |
| Left and Right Arrow on the bar, menu closed | Move focus to the previous or next top item, wrapping from the last to the 1st. Home and End go to the 1st and the last top item, as in the APG examples. |
| Left and Right Arrow with a menu open | Close the menu, move focus to the neighbor top item and open its menu, keeping focus on that top item, as the APG recommends and its menubar-editor example does (focus on the 1st item is the APG alternative). On an item with a submenu, Right Arrow opens the submenu (submenu line). |
| Enter, Space and Down Arrow on the top item | Open the menu and focus the 1st item. Up Arrow opens the menu and focuses the last item. |
| Up and Down Arrow, Home and End in the panel | Move between the items, wrapping from the last to the 1st. Home and End go to the 1st and the last item. A disabled item receives focus and does not run (`aria-disabled`). Radix skips the disabled item and does not wrap in the panel: the code adjusts to the APG. |
| Right and Left Arrow in the submenu | Right Arrow on an item with a submenu (or Enter and Space) opens the submenu and focuses its 1st item. Right Arrow on an item without a submenu closes the menu, moves focus to the next top item and opens its menu, keeping focus on that top item (APG). Left Arrow in the submenu closes the submenu and returns focus to the parent item. |
| Enter and Space on the items | Enter activates the item and closes the menu, also on the checkbox and the radio. Space on the checkbox and the radio checks without closing the menu; on a plain item, it does the same as Enter. Radix also closes on Space: the code adjusts to the APG. |
| Typing a letter | Focuses the next item of the open menu whose label starts with the letter, as in Radix (letters typed within 1 second form the search). |
| Esc | Closes the menu that has focus and returns focus to whoever opened it: the 1st Esc closes the submenu and focuses the parent item; the 2nd closes the panel and focuses the top item (DSA-69 D-5). On the top item with the menu closed, Esc does nothing. Radix closes the whole tree from the submenu: the code adjusts to the APG. |
| Focus on open and on close | By keyboard, the 1st item receives focus. By click, the panel opens with no item highlighted (Radix; the APG does not cover it). On close by Esc or on choosing an item, focus returns to the top item. |
| Click outside | Closes the menu, and focus stays where the person clicked, without returning to the top item (Radix; the APG does not cover it). A click on another top item switches menus. |
| Pointer × focus | The pointer over a top item switches menus when one is already open; with no menu open, the menu opens by click. In the panel, the pointer highlights the item and takes focus to it (DSA-45 D-6). |
| Near the window edge | The panel opens below, aligned with the start of the top item. Without room below, it flips up (flip); past the side edge, it slides horizontally (shift); with little height, it shrinks to the free space and scrolls (size). The collision padding to the window edge is 4 px (`core/space/100`, by value), a code setting (`collisionPadding`) with no token and no Figma part (decided, Pend. 22). |
| Submenu | An item with `submenu` opens a 2nd nph-dropdown-menu to the right of the panel, aligned by the top with the parent item, at `dropdown/submenu-offset`, in one level only. The nph-dropdown-menu itself does not open a nested menu (P92): the nph-menubar opens the second panel and places it, as the nph-context-menu does with its own submenu; P92 does not change. |
| Narrow screen | The application swaps the bar for a button with the `bars` icon (nph-icon-button in Figma; in code, the nph-button without text) that opens one nph-dropdown-menu with the menus of the bar as submenus. A menu that already has a submenu (e.g. File → Recent) shows those items under a group label, so it stays in one level. Mobile is out of v1 (decided, Pend. 6). |
| Overflow | The top items that do not fit go into a last top item `"Mais"` (More) at the end of the bar (a menuitem with `aria-haspopup` inside the bar, so the APG arrows keep working), which opens an nph-dropdown-menu with them as submenus, without wrapping the bar into a second line; a menu that already has a submenu shows those items under a group label, in one level (decided, Pend. 19). |
| Motion | The panel enters and leaves with `motion/enter-*` and `motion/exit-*`, sliding 4 px (`space/inline-tight`), as the nph-dropdown-menu (DSA-45 D-2). |
| Stays with the code | Events, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. |

The bar controls which panel is open; each item controls its own state and focus.

## Combined states (rule T11)

Rule T11 of the decision record: selected or checked + disabled keeps the background and the mark, under `state/disabled-opacity`; error + disabled: disabled wins, the error border goes away and only the opacity stays.

In the menubar the top item has neither selected nor error, so the combination does not apply to it. In the panel, a checked and disabled checkbox or radio keeps the mark under the opacity (root `6410:7911`; documentation, section 8, example "checked and disabled: the mark stays, under the disabled opacity"). No new token.

## Inherited decisions

Family: dropdown menu (select → dropdown menu → combobox → context menu), because the panel is the nph-dropdown-menu; and the nph-navigation-menu for the top item, because both are bars of triggers that open a panel.

- Follows DSA-45 D-2: the panel enters and leaves with `motion/enter-*` and `motion/exit-*`, sliding 4 px (`space/inline-tight`).
- Follows DSA-45 D-4: the item with a switch uses the small nph-switch (comes from the instance).
- Follows DSA-45 D-5: in single choice, the checked item gains the brand color and the check.
- Follows DSA-45 D-6: the pointer over an item takes keyboard focus to it.
- Follows DSA-36 D2 (applied in DSA-70): the checked radio uses `color/primary-text`.
- Follows DSA-69 D-4: the item icon at rest keeps the label color, as the nph-dropdown-menu code ships (`color/popover-foreground`). The Figma item instance reads `color/muted-foreground` on the icon; the code keeps D-4 and changes nothing.
- Follows DSA-69 D-5: the 1st Esc closes the submenu; the 2nd closes the menu.
- Follows DSA-62 D-3 in part: the panel appears with `motion/enter-*` and leaves with `motion/exit-*`; the top item has no arrow that rotates.
- Follows DSA-45 D-3: no forced hover of the checkbox and the switch inside the item; a limit of the piece, the same through the instance.
- Same value as DSA-45 D-1: 4 px between the trigger and the menu. The nph-dropdown-menu code uses `space/inline-tight`; the menubar uses `menubar/panel-offset` → `core/space/100`, the same value (Pend. 20).
- Does not follow DSA-67 D-2 (the open trigger of the dropdown uses gray): the open top item uses the primary palette, by the design owner's correction (decided, Pend. 2, 15 and 18). The nph-dropdown-menu trigger and the nph-breadcrumb ellipsis stay gray.
- Does not follow DSA-62 D-1 (each nph-navigation-menu trigger becomes a collapsed row on a narrow screen): the menubar uses the button with the `bars` icon that opens an nph-dropdown-menu (decided, Pend. 6), only for the menubar.
- Do not apply: DSA-62 D-5 (the menubar does not mark the current page), DSA-69 D-3 (long press of the context menu) and DSA-62 D-4 (closing delay of a panel that opens on hover).

## Order and alignment

In the bar, the parts go from left to right; in the panel, from top to bottom. Top items vertically centered, the label centered in the item; panel aligned with the start of the open top item; shortcut aligned with the end of the item; separator aligned with the start and the end of the panel; submenu to the right of the panel, aligned by the top with the parent item.

## Relations and context

It lives in the header of the application, on `color/background`. The bar has no background of its own: the background comes from where it lives (decided, Pend. 11: there is no header background variable; the header stays on `color/background`, and focus and text are measured against it).

The panel is the nph-dropdown-menu, by instance: radius, stroke, shadow, padding, width and items come from the approved piece, and the menubar binds none of its tokens.

| From → to | Space and rule |
|---|---|
| top item → top item | 8 px, `menubar/bar-gap` → `space/inline`. |
| bar → panel | 4 px, `menubar/panel-offset` → `core/space/100`. |
| panel → submenu | 4 px, `dropdown/submenu-offset` → `core/space/100` (in Figma by position). |
| panel → window edge | 4 px, `collisionPadding` in code, no token. |

Hover colors: the top item in hover or open uses the primary palette: background `menubar/trigger-background-hover` (`color/primary-surface-hover`) and text `menubar/trigger-foreground-hover` (`color/primary-on-surface-hover`). The panel item in hover uses the hover of the piece itself, `color/primary-surface`. The nph-navigation-menu, a sibling bar, uses `color/primary-surface` on the open trigger; the menubar is one step above, which also separates the open top item from the panel item in hover.

## When to use

- Use it when the application has many commands that group into a few subjects, and the person works with keyboard and mouse.
- Choose by case: commands of a whole application → nph-menubar; frequent actions in view → nph-toolbar; few actions of one button → nph-dropdown-menu; actions of the object under the pointer → nph-context-menu; going to another page → nph-navigation-menu or nph-sidebar.

Required examples, in light and dark: the editor with the File menu open, with shortcuts; the View menu with ruler and grid as checkboxes and density as radios; checked and disabled, where the mark stays under the disabled opacity; the Recent submenu with files opened a short while ago.

## Do

- Group the commands by subject and separate the groups with the separator, because whoever looks for a command finds it by category.
- Show the keyboard shortcut at the right of the item, because it teaches the shortcut to whoever uses the mouse.
- Use the checkbox and the radio of the item for display options, because the mark shows the state besides the color.
- Leave a command that does not apply now disabled, not hidden, because the person learns where it is.
- Build each panel with an instance of the nph-dropdown-menu, because the bar menu stays equal to the other Nephos menus and follows the piece when it changes.

## Do not

- Do not use it to navigate between pages. Instead: the nph-navigation-menu or the nph-sidebar. (Error example: top items that lead to pages.)
- Do not use it for the actions of a single object or a single button. Instead: the nph-context-menu or the nph-dropdown-menu. (Error example: a bar with a single top item.)
- Do not create a submenu inside a submenu. Instead: one level; what goes beyond goes to a dialog. (Error example: a 3rd panel opened from an item of the submenu.)

## Icon and image

| Piece | Weight, size and color |
|---|---|
| top item | No icon. |
| panel item start icon (nph-dropdown-menu piece) | `icon/size-md` (20); light at rest and disabled, solid in hover and in focus (variants of `1365:57`). In code, the solid is the twin of the same icon (`.glyph-hover`). In Figma the solid layer of the piece stays on `user` and the examples swap it by hand: one instance swap cannot drive the light and the solid twin; a second swap goes to the next approval round. Nothing for code. |
| submenu arrow (`chevron-right`) | `icon/size-sm` (16); light at rest and disabled, solid in hover and in focus, in the piece and in code, as the start icon. In Figma the arrow of the item in focus is now solid in the 6 focus variants, with the item color (decided). |
| single-choice check | `icon/size-sm` (16), solid in every state. |
| destructive item | trash (`trash`) in place of the start icon, with the same weight, along with the color. |
| narrow screen button | the nph-icon-button (in code, the nph-button without text) with the `bars` icon; size and weight of the icon come from that piece. |
| image | Does not apply; the menubar has no image. |

## Used directly, without a component token

| Where | Tokens and styles | Why |
|---|---|---|
| top item (`6402:4299`) | `focus/border`, `focus/halo`, `focus/ring-width`, `border/width`, `focus/border-radius-control`, `focus/radius-control-with-border`, `state/disabled-opacity` and the text style `text/label-md` | Focus and disabled are the same in the whole system, and a token of its own would duplicate the same rule; a token of its own only if the menubar needs a different value (decided, Pend. 7). |
| panel, read on the nph-dropdown-menu instance, not bound by the menubar | `dropdown/panel-radius` (12), `color/popover`, `color/dropdown-border` (→ `color/border-subtle`), `space/inline-tight` (4 around), `layout/input-width` (280), effect style `elevation/dropdown`; on the item `dropdown/item-radius` (8), `color/primary-surface` on hover, `color/popover-foreground`, `dropdown/item-destructive-foreground`, `dropdown/separator`, `color/muted-foreground` on the shortcut (and on the icon in Figma; the code keeps DSA-69 D-4), `icon/size-md` on the start icon and `icon/size-sm` on the submenu arrow and the check | They belong to the approved piece. |
| narrow screen button | the tokens of the nph-icon-button / nph-button | They belong to the approved piece. |

## Decisions answered

The 8 items of the approval round, all approved as recommended, none rejected:

| Item | Decision |
|---|---|
| 1 — acceptance | Documentation `6432:8686` accepted; root `6410:7413` accepted visually. |
| 2 — top item in hover and open (Pend. 2, 15 and 16) | Background `menubar/trigger-background-hover` → `color/primary-surface-hover`, label `menubar/trigger-foreground-hover` → `color/primary-on-surface-hover` (lowest 6.43:1 across 7 brands and 2 themes). It replaces the black text of the correction print (`color/accent-foreground`, lowest 6.82:1), because where the background is a light tone of the brand, the text becomes the dark tone of the brand. It is one step above the open trigger of the nph-navigation-menu (`color/primary-surface`), which stays as it is. The description of `color/primary-surface-hover` now names `color/primary-on-surface-hover` on top (the old pair measured 4.26:1, light, `Sistemas`). |
| 3 — focus border of the nph-dropdown-menu item (Pend. 9) | `focus/border` instead of `color/primary`, also in the nph-context-menu (same item). `color/primary` on `color/popover`, dark: Gerencial 1.83:1, Recursos Humanos 1.94:1, Igrejas 2.28:1, `Educação` 2.57:1 (passing: Financeiro 3.62:1, Comercial 4.17:1, `Sistemas` 4.59:1). With `focus/border`: Gerencial dark 5.53:1, lowest of 7 brands 4.32:1 (light, Comercial), above 3:1 (WCAG 1.4.11). Figma set `1365:57` already changed (6 focus variants); the code change is a point of this task. |
| 4 — solid submenu arrow in focus (Pend. 10) | In Figma the arrow of the item in focus is now solid, as the code (DSA-69). The solid layer of hover and focus following the start icon swap was not possible in Figma; it goes to the next approval round (a second swap). Nothing for code. |
| 5 — submenu gap (Pend. 21) | New token `dropdown/submenu-offset` → `core/space/100` (4), straight to core by decision: no semantic names the distance to a floating layer; `space/inline-tight`, also 4, is the space inside a unit and says DO NOT USE between independent elements. Used by the nph-context-menu and the nph-menubar. Without a token, the Radix default is 0. In Figma the submenu sits at that distance by position, without binding. |
| 6 — narrow screen (Pend. 6) | A button with the `bars` icon (nph-icon-button in Figma; in code, the nph-button without text) opens one nph-dropdown-menu with the menus as submenus; a menu that already has a submenu shows those items under a group label (one level). Mobile out of v1. It does not follow DSA-62 D-1, only for the menubar. |
| 7 — collision padding (Pend. 22) | 4 px to the window edge (`core/space/100`, used by value), only in code (`collisionPadding`), no token, no Figma part. |
| 8 — design rule for bar triggers (Pend. 18) | A bar trigger (menu bar, navigation) open or in hover uses the primary palette, not gray; only for bars. The nph-dropdown-menu trigger and the nph-breadcrumb ellipsis stay gray (DSA-67 D-2). No approved piece changes with this component. |

Points of the appendix that were not among the 8 items. Origin: answered with no question, "follow the recommendation, approved with the page".

| Point | Decision |
|---|---|
| Token `menubar/bar-gap` | → `space/inline`. |
| Token `menubar/trigger-height` | → `control/height-default`. |
| Token `menubar/trigger-padding-x` | → `space/control-padding`. |
| Token `menubar/trigger-radius` | → `radius/control`. |
| Token `menubar/trigger-foreground` | → `color/foreground`. |
| Token `menubar/panel-offset` | → `core/space/100`, as `navigation-menu/panel-offset`; the nph-dropdown-menu code uses `space/inline-tight` (DSA-45 D-1), the same value (Pend. 20). |
| Pend. 4 — submenu as an axis of the set | Only an example; the submenu is the `submenu` property of the nph-dropdown-menu item, on the instance, because the whole panel comes from the piece. |
| Pend. 5 — compact size of the top item (28, `control/height-compact`) | Not created in v1: T4 limits the compact size to toolbar, filter and floating layer footer, and 36 matches the header. |
| Pend. 7 — system values used directly on the top item | Kept direct, as the approved precedents (see "Used directly"). |
| Pend. 8 — gap between the top items differs from the nph-navigation-menu | `space/inline` (8), by its description ("items of a bar"); `navigation-menu/bar-gap` (4) stays. |
| Pend. 11 — no header background variable | The header stays on `color/background`; focus and text are measured against it. If one day it differs, the semantic is created and the measure redone. |
| Pend. 12 — fixed width of 80 on the top item | The width hugs the label, with `space/control-padding` (12) on each side, because no researched system fixes the trigger width and a translated label grows. |
| Pend. 14 — four fixed item slots in the nph-dropdown-menu instance | In v1 the examples stay in the four slots and the code builds the whole list; later, propose to the nph-dropdown-menu a native Figma slot instead of the fixed rows. |
| Pend. 17 — panel width | 280, the default width of the piece, no new token, because the bar menu carries a shortcut on the right and 280 fits the label and the shortcut. |
| Pend. 19 — more top items than fit the width | The overflow top item `"Mais"` (More), as in "Default behavior"; the bar does not wrap into two lines, because two lines change the reading order and the arrow navigation. |
| Pend. 20 — two 4 px paths between the bar and the panel | `menubar/panel-offset` → `core/space/100`, rule 3. Same value as `space/inline-tight`. |

## Open for the code

- Events, aria, slot, property and console warning, following the APG and the Custom Elements Manifest.
- How the menus and their items are given to the component (one nph-dropdown-menu per top item, or data), and how a chosen item is reported.
- How the overflow is measured (which top items go into `"Mais"`, and when the narrow screen button replaces the bar): the breakpoint is the application's call or a component property. Also who renders the narrow screen button and opens its submenus, the nph-menubar or the application (decision 6 says the application swaps the bar).
- How the nph-menubar opens and places the second panel (submenu, narrow screen button, `"Mais"`): the nph-dropdown-menu does not nest a menu (P92), so the nph-menubar does it, as the nph-context-menu does.
- Top item open and in keyboard focus at once (the arrows switch menus and focus stays on the top item, APG): not drawn in Figma (`6402:4299` draws `hover-aberto` and `foco` apart); the combined look goes to the design owner in the next approval round, before the code ships it.
- How the texts come in, already translated: the top item labels, `"Mais"` and the accessible name of the narrow screen button.
- In approved pieces, part of this task: the focus border of the nph-dropdown-menu item to `focus/border` (`nph-dropdown-menu.css`, `.item:focus-visible::before`, today `color/primary`), which also reaches the nph-context-menu; and `dropdown/submenu-offset` as the gap of the submenu in the nph-context-menu and the nph-menubar.

## Outside this task

No second submenu level, compact size, vertical bar or mobile layout in v1. No change to the gray open trigger of the nph-dropdown-menu (DSA-67 D-2) nor the ellipsis of the nph-breadcrumb. The code does not create a token or change a token value.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1626:15`: documentation frame `6432:8686`, root `6410:7413`, sets `6410:7769`, `6402:4299` and `1365:57`
- WAI-ARIA APG, menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- WAI-ARIA APG, menubar editor example: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-editor/
- WAI-ARIA APG, menubar navigation example: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- Radix Menubar: https://www.radix-ui.com/primitives/docs/components/menubar ; https://github.com/radix-ui/primitives/blob/main/packages/react/menu/src/menu.tsx ; https://github.com/radix-ui/primitives/blob/main/packages/react/menubar/src/menubar.tsx
- Floating UI: https://floating-ui.com/docs/flip ; https://floating-ui.com/docs/shift ; https://floating-ui.com/docs/size
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html ; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` and `src/tokens/source/semantic.tokens.json` (groups `menubar` and `dropdown`)
- `src/components/nph-dropdown-menu/nph-dropdown-menu.css`; `docs/operacao/tarefas/DSA-45.md`, `DSA-62.md`, `DSA-67.md`, `DSA-69.md`
