```json
{
  "task": "DSA-62",
  "gate": "figma-docs-accepted",
  "date": "2026-11-03",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=3977-7913",
    "date": "2026-11-03",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-navigation-menu documentation frame (3977:7913, page 1626:16), with the Figma UX QA and the textual audit approved, and answered the twelve open points of the appendix as recommended. COMPONENT_SET nph-navigation-menu (3969:7897), largura × aberto, 4 variants; COMPONENT_SET item de topo (3957:6662), tipo × state, 12 variants; COMPONENT_SET link do painel (3957:6722), ícone × state, 12 variants."
  }
}
```

# DSA-62 — `figma-docs-accepted`

The documentation of `nph-navigation-menu` (frame `3977:7913`) was accepted in Figma on 2026-11-03, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The piece needed 31 `navigation-menu/*` tokens, put on `v/5.0.0` together with this task. All of them are aliases of a semantic token, except two that point straight to a core primitive because no semantic token has the same function:

- `navigation-menu/panel-width` → `{core.layout-width.input}` (280 px).
- `navigation-menu/current-indicator-width` → `{core.focus-width.sm}` (2 px).

No core primitive was added.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property names stay as they are in Figma (`largura`, `aberto`, `tipo`, `state`, `ícone`, `título`, `descrição`, `mostrar descrição`, `rótulo`); the code API is in English.

## Purpose

The main navigation of a product in a horizontal bar: direct links and triggers that open a panel with grouped links. Use it for the main sections of a product or site, always visible at the top. A trigger opens a panel with the links of its section; a top link goes straight to the page. In the narrow width, the bar turns into the Menu button, which opens the same list vertically.

It does not replace an application command bar (menubar), nph-dropdown-menu (actions on an object), nph-tabs (switching content on the same page) or nph-sidebar (side navigation with several levels).

## Anatomy

1. **Bar** — the row of top items.
2. **Trigger** — top item with an arrow (`chevron-down` from nph-icon) that opens the panel.
3. **Top link** — top item without an arrow; goes straight to the page.
4. **Current indicator** — thin bar under the top item of the current page and at the left of the current panel link.
5. **Panel** — floating surface.
6. **Group label** — instance of the group label of nph-dropdown-menu.
7. **Panel link** — title, optional description and optional nph-icon.
8. **Separator** — vertical nph-separator between groups.
9. **Menu button** — nph-icon-button with the `bars` icon, only in the narrow width.

## Properties

| Figma property | Rule |
|---|---|
| `largura` | `larga` / `estreita` (wide / narrow). Wide shows the bar; narrow swaps the bar for the Menu button. |
| `aberto` | `não` / `sim` (open). Open shows the panel of the active trigger (wide) or the vertical list (narrow). |
| `tipo` (top item) | `gatilho` (trigger: arrow, opens a panel) / `link` (no arrow, goes to the page). |
| `state` (top item) | `default`, `hover-aberto` (trigger hovered or open), `hover` (link), `foco`, `disabled`, `atual`, `atual-foco`. |
| `rótulo` | Top item text. |
| `ícone` (panel link) | `não` / `sim`. Yes shows an nph-icon at the left. |
| `state` (panel link) | `default`, `hover`, `foco`, `disabled`, `atual`, `atual-foco`. |
| `título`, `descrição`, `mostrar descrição` | Panel link texts; `mostrar descrição` turns the second line on or off. |
| Not a property | How many top items, groups and links the panel has: it is composition, with panel link, group label and separator instances. Light or dark comes from the color scheme. |

`atual-foco` is the current item receiving focus: it keeps the current text and indicator and adds the focus border and halo.

## Tokens of each part

| Part | Token | Points to |
|---|---|---|
| Top item text, rest | `navigation-menu/trigger-foreground` | `{color.foreground}` |
| Top item background, hover and open trigger | `navigation-menu/trigger-background-hover` | `{color.primary-surface}` |
| Top item text, hover and open trigger | `navigation-menu/trigger-foreground-hover` | `{color.accent-foreground}` |
| Top item padding, start and end | `navigation-menu/trigger-padding-x` | `{space.control-padding}` |
| Top item padding, top and bottom | `navigation-menu/trigger-padding-y` | `{space.inline}` |
| Gap between label and arrow | `navigation-menu/trigger-gap` | `{space.inline-tight}` |
| Top item radius | `navigation-menu/trigger-radius` | `{radius.control}` |
| Trigger arrow size | `navigation-menu/trigger-icon-size` | `{icon.size-sm}` |
| Gap between top items | `navigation-menu/bar-gap` | `{space.inline-tight}` |
| Gap between bar and open panel | `navigation-menu/panel-offset` | `{space.inline-tight}` |
| Panel background | `navigation-menu/panel-background` | `{color.popover}` |
| Panel border color | `navigation-menu/panel-border` | `{color.dropdown-border}` |
| Panel border width | `navigation-menu/panel-border-width` | `{border.width}` |
| Panel radius | `navigation-menu/panel-radius` | `{radius.container}` |
| Panel padding, four sides | `navigation-menu/panel-padding` | `{space.inline-tight}` |
| Narrow panel width and panel link width | `navigation-menu/panel-width` | `{core.layout-width.input}` |
| Vertical gap inside a group and in the narrow list | `navigation-menu/group-gap` | `{space.inline-tight}` |
| Panel link background, hover | `navigation-menu/item-background-hover` | `{color.primary-surface}` |
| Panel link title | `navigation-menu/item-title-foreground` | `{color.popover-foreground}` |
| Panel link title, hover | `navigation-menu/item-title-foreground-hover` | `{color.accent-foreground}` |
| Panel link description | `navigation-menu/item-description-foreground` | `{color.muted-foreground}` |
| Panel link padding, four sides | `navigation-menu/item-padding` | `{space.inline}` |
| Gap between icon and texts | `navigation-menu/item-gap` | `{space.inline}` |
| Gap between title and description | `navigation-menu/item-text-gap` | `{space.inline-tight}` |
| Panel link radius | `navigation-menu/item-radius` | `{radius.inner}` |
| Panel link icon size | `navigation-menu/item-icon-size` | `{icon.size-md}` |
| Panel link icon color | `navigation-menu/item-icon-foreground` | `{color.muted-foreground}` |
| Panel link icon color, hover | `navigation-menu/item-icon-foreground-hover` | `{color.accent-foreground}` |
| Current item text (top item and panel link) and current panel link icon | `navigation-menu/current-foreground` | `{color.primary-hover}` |
| Current indicator color | `navigation-menu/current-indicator-background` | `{color.primary}` |
| Current indicator thickness | `navigation-menu/current-indicator-width` | `{core.focus-width.sm}` |

Without a token of its own:

- **Focus.** Border `color/primary` with `border/width` and halo `focus/halo` with `focus/ring-width`, outside the piece, without changing its size. Top item: radius `focus/border-radius-control` (border) and `focus/radius-control-with-border` (halo). Panel link: `focus/border-radius-inner` and `focus/radius-inner-with-border`. Focus is keyboard only.
- **Disabled.** `state/disabled-opacity` on the whole item; no hover, no focus.
- **Panel shadow.** Effect style `elevation/dropdown`.
- **Menu button.** The tokens of nph-icon-button (secondary, ghost, default size, square).
- **Typography.** Text role `text/label-md` for the top item label and the panel link title; `text/body-sm` for the description.
- The gap between the two groups of the wide panel stays on `space/inline-tight`, with the vertical nph-separator between them.

## States

| State | Top item | Panel link |
|---|---|---|
| `default` | Text `trigger-foreground`, no background. | Title `item-title-foreground`, description and icon in their tokens, no background. |
| `hover-aberto` / `hover` | Background `trigger-background-hover`, text `trigger-foreground-hover`. The open trigger keeps this look while its panel is open. | Background `item-background-hover`, title `item-title-foreground-hover`, icon `item-icon-foreground-hover`. |
| `foco` | Rest look plus focus border and halo. | Rest look plus focus border and halo. |
| `disabled` | `state/disabled-opacity`. | `state/disabled-opacity`. |
| `atual` | Text `current-foreground`; indicator at the bottom, full width, `current-indicator-width` thick, `current-indicator-background`. | Title and icon `current-foreground`; indicator at the left, full height. |
| `atual-foco` | `atual` plus focus border and halo. | `atual` plus focus border and halo. |

The current page is never told by color alone: the indicator always comes with the current text color (WCAG 1.4.1).

## Behavior

- **Opening.** A trigger opens its panel on click, Enter or Space. On pointer hover, open after 0.3 to 0.5 s and close 0.5 s after the pointer leaves; the panel stays open while the pointer is over it. Use `motion/hover-delay` for the wait. Esc closes the panel and returns focus to its trigger.
- **Pattern.** Disclosure navigation, not menubar: the bar is a `nav` with `aria-label`; each trigger is a button with `aria-expanded` and `aria-controls`; the link of the current page has `aria-current="page"`. Keyboard: Tab moves between items, Enter or Space opens and closes, Esc closes.
- **Narrow width.** The Menu button has `aria-label` "Menu" and `aria-expanded`, and opens the same items as a vertical list in a panel `panel-width` wide, with the current item marked.
- The trigger arrow and the panel link icon are decorative (`aria-hidden`).
- The wide panel hugs its content; only the narrow panel and the panel link take `panel-width`.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Text on `color/foreground` over `color/background` and `color/popover-foreground` over `color/popover`; description on `color/muted-foreground`. The indicator and the focus border, in `color/primary`, have at least 3:1 against the background in both schemes (read in Figma: 5.37:1 light; 6.81:1 on the dark bar, 4.59:1 on the dark panel). The halo is extra; the border is what meets 3:1. |
| Visible focus | Top item and panel link in focus show the border and the halo. The Menu button uses the focus of nph-icon-button. |
| Color is not the only cue | The current page has the indicator besides the text color. The open trigger shows the panel and the hover background. |
| Target size | Top item and Menu button exceed 24 × 24 px; the Menu button uses `control/height-default`. |
| Accessible name | See Behavior. |

## When to use

- Few main and stable sections that need to stay visible at the top.
- A trigger when the section has inner pages; a top link when it goes straight to one page.
- `largura=estreita` when the items do not fit on one line.
- Two labeled groups when the panel puts together links of different kinds.

## Do

- One current item per menu.
- A trigger only when the section has inner pages.
- Group panel links with a group label when they are of different kinds.

## Do not

- Do not use the menu for actions, such as delete; use nph-dropdown-menu. Navigation goes to pages, it does not change data.
- Do not mark the current page by color alone; use the current state, which brings the indicator.
- Do not hide the bar behind the Menu button when the items fit; menus hidden away reduce discovery of the sections.

## Required examples

- Closed bar: two triggers and the link of the current page.
- Open trigger: panel with two groups of links.
- Narrow width: Menu button open with the vertical list.

## Decisions answered in the appendix

Indiane answered the twelve open points of the appendix of the Figma page as recommended:

1. The decision map says "Adia" (defer) for this piece; the board built in Figma stays and becomes this task.
2. Hover of the trigger and the panel link: `color/primary-surface` background with `color/accent-foreground` text, as in nph-dropdown-menu.
3. Panel border: `color/dropdown-border` (floating surface), not `color/input`.
4. Width: `panel-width` straight on `core/layout-width/input` for the narrow panel and the panel link; the wide panel hugs its content.
5. No featured card inside the panel in this version.
6. Panel link focus is separate from hover: border plus halo, as in nph-dropdown-menu.
7. Typography: `text/label-md` for label and title, `text/body-sm` for description.
8. Hover delay and closing as described in Behavior.
9. Disclosure pattern, not menubar.
10. Current indicator besides color: 2 px bar in `color/primary` (bottom on the top item, left on the panel link).
11. Vertical spacing stays on the `space/inline*` semantic tokens, as in the approved nph-dropdown-menu; a later foundation review may propose inset and stack semantic tokens.
12. The current item in focus is the `atual-foco` state, created in both sets before the tokens.
