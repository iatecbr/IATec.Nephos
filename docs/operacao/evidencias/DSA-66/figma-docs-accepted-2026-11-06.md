```json
{
  "task": "DSA-66",
  "gate": "figma-docs-accepted",
  "date": "2026-11-06",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4512-4741",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-breadcrumb documentation frame (4512:4741, page 1626:13), with the Figma UX QA and the textual audit approved, and approved the 12 points of the approval page: documentation acceptance; core/layout-width/menu-min (128) as a new core value for the menu floor; core/target-size/minimum (24) as a new core group for the ellipsis target; the menu ceiling straight to core/layout-width/input (280); the width that hugs the content only in the breadcrumb for now; min-inline-size and max-inline-size in the code; old sets with the same names swapped out of the draft pages; the decision map aligned; the link kept as an inner piece until nph-link exists; the focus border of the menu item and the menu radius reviewed in nph-dropdown-menu itself; loading as a documentation rule only. COMPONENT_SET nph-breadcrumb (4490:2886), levels × icons, 8 variants; COMPONENT_SET nph-breadcrumb item set (4490:2678), type × state, 4 variants; COMPONENT_SET nph-breadcrumb ellipsis set (4490:2697), state, 4 variants; COMPONENT nph-breadcrumb separator (1635:16)."
  }
}
```

# DSA-66 — `figma-docs-accepted`

The documentation of `nph-breadcrumb` (frame `4512:4741`) was accepted in Figma on 2026-11-06, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The piece needed 22 `breadcrumb/*` tokens, put on `v/5.0.0` together with this task, plus seven core primitives:

- `core/layout-width/menu-min` (128), a new value. By decision it goes to core: `core/space/1400` and `core/image-size/600` also resolve to 128, but they are a spacing step and an image size, not a width.
- `core/target-size/minimum` (24), a new group. By decision it goes to core: the existing 24 values are an icon box, spacing, radius, avatar, image, logo height or text size, and none of them is a click and touch target.
- `core/size/200` (14), `core/line-height/200` (20), `core/tracking/normal` (0), `core/weight/regular` (400) and `core/weight/medium` (500), which Figma had and the code did not.

`breadcrumb/menu-max-width` points straight to `core/layout-width/input` (280), by decision: `layout/input-width` also resolves to 280, but its function is the width of a field. The label typography (`breadcrumb/font-family`, `font-size`, `line-height`, `letter-spacing`, `link-font-weight` and `current-font-weight`) points straight to core, by decision: there is no semantic token per typography property, and `text/body-md` is a text role with its own values; in Figma the item label is bound to the same core variables. Every other `breadcrumb/*` token is an alias of a semantic token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`niveis`, `ícones`, `tipo`, `state`, `rótulo`, `ícone`, `⮑ ícone`, `⮑ ícone solid`); the code API is in English. Figma sample labels are translated here: the first level reads "Home".

## Purpose

Shows the path to the current page and leads back to each level above.

Use it on a page that sits inside a hierarchy, so the person can go up a level. It does not replace the navigation menu, the tabs or the back button, and it does not show the history of visited pages.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `breadcrumb/link-foreground` | `color/muted-foreground` | Link text and icon |
| `breadcrumb/link-foreground-hover` | `color/foreground` | Link text and icon, hover |
| `breadcrumb/link-foreground-focus` | `color/foreground` | Link text and icon, focus |
| `breadcrumb/current-foreground` | `color/foreground` | Current page text and icon |
| `breadcrumb/separator-foreground` | `color/muted-foreground` | Separator chevron |
| `breadcrumb/ellipsis-foreground` | `color/muted-foreground` | Ellipsis icon, rest and focus |
| `breadcrumb/ellipsis-foreground-hover` | `color/foreground` | Ellipsis icon, hover and open |
| `breadcrumb/ellipsis-background-hover` | `color/accent` | Ellipsis background, hover and open |
| `breadcrumb/icon-size` | `icon/size-sm` (16) | Separator and ellipsis icon |
| `breadcrumb/item-icon-size` | `icon/size-sm` (16) | Level icon |
| `breadcrumb/item-icon-gap` | `space/inline-tight` (4) | Level icon to label |
| `breadcrumb/item-radius` | `radius/control` (6) | Item and ellipsis; shows on the hover background and on focus |
| `breadcrumb/gap` | `space/inline` (8) | Between the parts of the trail: item, separator and ellipsis |
| `breadcrumb/menu-min-width` | `core/layout-width/menu-min` (128) | Hidden levels menu, floor |
| `breadcrumb/menu-max-width` | `core/layout-width/input` (280) | Hidden levels menu, ceiling |
| `breadcrumb/ellipsis-target-size` | `core/target-size/minimum` (24) | Ellipsis button, width and height |
| `breadcrumb/font-family` | `core/font/sans` | Item label |
| `breadcrumb/font-size` | `core/size/200` (14) | Item label |
| `breadcrumb/line-height` | `core/line-height/200` (20) | Item label and trail |
| `breadcrumb/letter-spacing` | `core/tracking/normal` (0) | Item label |
| `breadcrumb/link-font-weight` | `core/weight/regular` (400) | Link label |
| `breadcrumb/current-font-weight` | `core/weight/medium` (500) | Current page label |

Focus has no token of its own: link and ellipsis use the global `focus/border`, `border/width`, `focus/border-radius-control`, `focus/halo`, `focus/ring-width` and `focus/radius-control-with-border`. The hidden levels menu is an nph-dropdown-menu instance and keeps its own tokens, except the floor and the ceiling of its width above.

## Anatomy

Reference instance: `niveis=recolhido`, `ícones=com`, which shows every part.

1. **Level icon** — optional. An nph-icon at `breadcrumb/item-icon-size`, before the label, in the same color as the label: light style on the link and solid style on the current page. It is decorative. The gap to the label is `breadcrumb/item-icon-gap`.
2. **Link** — a level above the current page. Text in Noto Sans 14, regular, in `breadcrumb/link-foreground`; on hover it turns `breadcrumb/link-foreground-hover` with an underline; on focus, `breadcrumb/link-foreground-focus` with the focus border and the halo. Radius `breadcrumb/item-radius`.
3. **Separator** — the nph-icon `chevron-right` at `breadcrumb/icon-size` in `breadcrumb/separator-foreground`, between the levels. It is decorative; in right-to-left writing it mirrors.
4. **Ellipsis** — a 24 x 24 button (`breadcrumb/ellipsis-target-size`) with the nph-icon `ellipsis` at `breadcrumb/icon-size` in the middle, in place of the middle levels, only in the collapsed trail. It opens the nph-dropdown-menu with the hidden levels. The icon is `breadcrumb/ellipsis-foreground` at rest and on focus and turns `breadcrumb/ellipsis-foreground-hover` on hover and with the menu open, together with the `breadcrumb/ellipsis-background-hover` background. Radius `breadcrumb/item-radius`.
5. **Current page** — the last level. Text in medium weight (`breadcrumb/current-font-weight`) and `breadcrumb/current-foreground`, with no action; with icons, the solid icon.

The gap between the parts of the trail is `breadcrumb/gap`.

## Properties

| Figma property | Rule |
|---|---|
| `niveis` (trail) | `2`, `3`, `4` or `recolhido` (collapsed). The numbers say how many levels show, the current page included. Collapsed shows the first level, the ellipsis and the last two. |
| `ícones` (trail) | `sem` (without) or `com` (with). With icons, every level has an icon; without, none. The two never mix in the same trail. |
| `tipo` (item) | `link` or `atual` (current). Link navigates; current is the last level, in text, and does not navigate. |
| `state` (item) | `default`, `hover` or `foco` (focus). In the item, only the link changes state; the current page has no hover and no focus. |
| `rótulo` (item) | The level text, on one line only. The first level is "Home". |
| `ícone` (item) | Boolean. Turns the level icon on. Off by default. |
| `⮑ ícone` and `⮑ ícone solid` (item) | The same icon in the two styles: the light one shows on the link and the solid one on the current page. Swap both together, to the same icon name. |
| `state` (ellipsis) | `default`, `hover`, `foco` (focus) or `aberto` (open). Hover and open get the `breadcrumb/ellipsis-background-hover` background. |

Not properties:
- **Hidden levels menu**: it is the nph-dropdown-menu, with no header and no group label. Its width hugs the widest option, between 128 and 280 px (`breadcrumb/menu-min-width` and `breadcrumb/menu-max-width`); text past the ceiling is cut with an ellipsis.
- **Separator**: an inner piece, always present between the levels, with the nph-icon `chevron-right`.
- **Color, theme and size**: the theme comes from the tokens and the trail has a single size: Noto Sans 14, regular on the link and medium on the current page.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Links, separator, link icons and the ellipsis at rest, in `color/muted-foreground`, and the current page in `color/foreground` pass the required WCAG level over `color/background`, in both themes. The current page has the highest contrast of the trail, never lower than the links. |
| Visible focus | Link and ellipsis show the focus border `focus/border`, of `border/width`, with the `focus/halo` halo outside. The border is the signal that meets 3:1 over the background in both themes; the halo is reinforcement. The current page takes no focus. |
| Color is not the only signal | The current page stands apart without relying on color: it is not a link, it has medium weight and, with icons, it shows the solid icon. The link hover adds the underline to the color change. |
| Touch target | The ellipsis has a 24 x 24 area (WCAG 2.5.8). Links are 20 px tall and sit 32 px from each other, with the separator in between, which meets the spacing exception of the same rule. |
| Accessible name | The trail is a navigation landmark with a label (`aria-label`) and the current page carries `aria-current="page"`. Separator and level icons are decorative (`aria-hidden`): the level name comes from the label. The ellipsis has its own name (`aria-label` "Show hidden levels"), because the icon has no text. |

Contrasts measured in the Figma UX QA, not written in the documentation frame (light / dark): links, separator and ellipsis at rest 6.69 / 9.81; current page 21.00 / 14.73.

## Relations and context

- It sits above the page title, at the top of the content. It does not replace the navigation menu.
- The ellipsis opens the nph-dropdown-menu with the hidden levels, in path order, with no header and no group label.
- The icons come from nph-icon: `chevron-right` on the separator, `ellipsis` on the ellipsis button and the icon of each level.
- The gap between the parts is `breadcrumb/gap`; between icon and label, `breadcrumb/item-icon-gap`. Color and state come from the color and focus tokens of the system; focus uses `focus/border` and `focus/halo`.
- On a narrow screen, use the collapsed trail: it stays on one line. In right-to-left writing, the separator mirrors.
- While the page loads, a line nph-skeleton takes the place of the trail.

## When to use

- Use it on pages that sit inside a hierarchy, when the person needs to go up a level.
- Choose `niveis` by the real path of the page. Use collapsed when the trail does not fit the width.
- Icons are optional. When the trail uses icons, every level has its own.
- The first level is the text "Home". With icons, the house comes next to the text, never alone.

## Required examples

- Two levels, text only: a short trail, with the current page at the end.
- Four levels with icons: each level with its own icon; the current page with the solid icon.
- Long collapsed trail with the menu open: the middle levels sit in the menu.

## Do

- Make the last level the current page, in text — the person sees where they are and there is no link to the page itself.
- Make each level above a link to its page — the person goes straight to the level they choose.
- Use collapsed when width runs short — the trail stays on one line, with the first level and the last ones in view.
- Write short labels, the same as the title of the target page — the person recognizes the place without rereading.
- With icons, put an icon on every level and swap `⮑ ícone` and `⮑ ícone solid` to the same icon — the level keeps the same figure when it becomes the current page.

## Do not

- Do not use the current page as a link — use `tipo=atual`, in text: the link would lead to the page itself.
- Do not let the trail overflow the width or wrap — use the collapsed trail, which keeps a single line.
- Do not put an icon on only some levels — with icons, use them on all; without, on none.
- Do not leave the house alone on the first level — put the text "Home" next to it: the icon alone does not say where it leads.

## Appendix points answered

1. Menu floor: `core/layout-width/menu-min` (128), a new core value; `breadcrumb/menu-min-width` points to it.
2. Ellipsis target: `core/target-size/minimum` (24), a new core group; `breadcrumb/ellipsis-target-size` points to it.
3. Menu ceiling: `breadcrumb/menu-max-width` points straight to `core/layout-width/input` (280), like `navigation-menu/panel-width`.
4. Menu width that hugs the content: only in the breadcrumb for now. When nph-dropdown-menu is reviewed, the range becomes `dropdown-menu/min-width` and `dropdown-menu/max-width`, and the breadcrumb points to them.
5. In the code, the width follows the content, with `min-inline-size` 128, `max-inline-size` 280 and text cut with an ellipsis.
6. The link stays an inner piece of the breadcrumb until an nph-link exists, then swaps to it.
7. Focus of the menu item: the move of nph-dropdown-menu to `focus/border` is done in a round of nph-dropdown-menu itself; the breadcrumb does not change the instance.
8. Loading: no loading state in the piece; the documentation rule is a line nph-skeleton in place of the trail.
9. Menu radius (8): reviewed in nph-dropdown-menu itself; the breadcrumb does not change it.
