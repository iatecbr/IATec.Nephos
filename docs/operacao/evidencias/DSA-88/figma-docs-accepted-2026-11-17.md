```json
{
  "task": "DSA-88",
  "gate": "figma-docs-accepted",
  "date": "2026-11-17",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=6516-13647",
    "date": "2026-11-17",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-card root (6478:6670), and its documentation frame (6516:13647, page 1626:28) was accepted, with COMPONENT_SET nph-card (6478:6673) and COMPONENT_SET nph-card start (6478:7282). In a test round of 17-11 without the approval page, the 21 approval items were taken as recommended: (1) documentation 6516:13647 and appendix accepted; (2) card/border and card/divider point to color/border-subtle, whose description now names the nph-card; (3) the clickable hover raises only the outline, card/border-hover to color/border, with background and shadow unchanged; (4) the start icon box uses color/primary-surface with color/primary-on-surface; (5) new focus radii focus/border-radius-surface (15) and focus/radius-surface-with-border (19), on the new primitives core/radius/off-scale/15 and /19; (6) footer padding 24 (16 compact) and 8 between actions; (7) new semantic space/surface-padding (24); (8) new semantic radius/inset (8); (9) card/icon-container-padding straight to core/space/200; (10) the start image is 48 px; (11) title in text/heading-md, compact in text/heading-xs; (12) media at the top in 16:9, side media about 40% (33% compact), cover crop, moves to the top on a narrow container, images exported at 2x; (13) the nph-collapsible card appearance is aligned in its own next adjustment, not here; (14) nothing interactive inside the clickable card, the menu action is 28 px and 36 px on touch; (15) the divider is a boolean, on by default when the footer has actions; (16) out of v1: the types marked out in the benchmark, selection stays with nph-rich-option; (17) assembly model with numbered zones, no native Figma slot; (18) names elevated and outlined, start, title truncation before the status, code slot names; (19) default behavior: one Tab stop on the clickable card, stretched link with CSS only, loading with aria-busy and a hidden Loading text, collection as a list with a configurable heading; (20) the old root and the set of 05-11 stay until their outside instances are replaced (design file only); (21) the decision map lists the nph-card and the nph-image as in v1. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-88 — `figma-docs-accepted`

The documentation of the nph-card (frame `6516:13647`, page `1626:28`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `6478:6670`. The card is a surface that groups the content and the actions of one subject. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `card/*`, 30 tokens in the semantic collection. 29 alias semantics (rule 2 of T9). One points straight to the core by decision (rule 3 of T9): `card/icon-container-padding` (`core/space/200`). The semantics with the same value do not serve: `space/inline` is the space between independent elements, `space/stack-snug` the space after a heading, and `radius/inset` and `core/radius/400` are corners; none has the function of breathing room inside a small box, and the box has a single consumer.
- New semantics: `focus/border-radius-surface` (`core/radius/off-scale/15`, 15) and `focus/radius-surface-with-border` (`core/radius/off-scale/19`, 19), the radii of the 1 px focus border and of the halo around a piece with `radius/surface` (14), the same family as `focus/border-radius-control` and `focus/radius-control-with-border`; `space/surface-padding` (`core/space/600`, 24), the inner padding of a card in the default density; `radius/inset` (`core/radius/400`, 8), a surface or box fitted inside a card.
- New primitives in the core: `core/radius/off-scale/15` and `core/radius/off-scale/19` (new value first in the core, rule 4 of T9).
- Descriptions changed, in Figma and in `design.md`: `color/border-subtle` (a soft border of a surface, now the nph-card outline and divider; no longer "not on a card"), `color/border` (the outline of the clickable card in hover; the resting outline and the divider of the card go to `color/border-subtle`), `color/border-strong` (the card hover stays in `color/border`), `color/primary-surface` (the tonal icon box of the card), `space/container-padding` (also the compact card; the default card is `space/surface-padding`), `space/overlay-padding`, `radius/inner` (no longer "icon with background"; the thumbnail stays, because `image/radius-sm` and `table/thumbnail-radius` use it), `radius/container`, `focus/radius-surface`. In `design.md` also: the spacing table (2c), the radius table (2d), the elevation rule "border and shadow together" (2e) and the anti-pattern A48, which now allow the soft outline with the shadow on the raised card, and the dark mode limitation (§3).
- Extended `use` in `design.md`: `color/card`, `color/card-foreground`, `color/muted-foreground`, `color/muted`, `color/primary-on-surface`, `border/width`, `space/stack`, `space/stack-snug`, `space/inline`, `state/disabled-opacity`, `icon/size-lg`, `icon/size-sm`, `radius/surface`.
- Left without a component token: focus (`focus/border`, `border/width`, `focus/halo`, `focus/ring-width` and the two new focus radii); elevation (`elevation/raised`); text styles; the pieces by instance (nph-avatar, nph-image, nph-badge, nph-button, nph-icon-button, nph-separator, nph-skeleton, nph-icon) keep their own tokens.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Where a point is not one of the 21 approval items, it follows the recommendation of the appendix, accepted with the documentation (item 1).

## Purpose

Groups on one surface the content and the actions of one subject, for the person to read, compare or open that subject.

Use it for a subject that stands on its own: the summary of a record, an item of a collection or a block of data on a detail page. The card does not replace the list (items in sequence, with no container of their own), the table (comparing data in columns), the nph-rich-option (choosing one among several) nor the nph-collapsible (content that opens and closes). To build a new card, follow the assembly model below.

Selection in Figma: `tipo` (type: `base`, `clicável` clickable, `seção` section) by what the card does; `superfície` (surface: `elevado` elevated, `contornado` outlined) by the background where it sits; `mídia` (media: `nenhuma` none, `topo` top, `topo recuada` inset top, `lateral` side) when there is a large image; `densidade` (density: `padrão` default, `compacta` compact) by the space available; `estado` (state) by the interaction. Parts that turn on and off: `início` (start), `descrição` (description), `status`, `ação no header` (header action), `seção tonal` (tonal section), `rodapé` (footer) and `divisória` (divider). The start swaps its piece in the `nph-card / início` instance: icon, avatar or image.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-card | `6478:6673` | `tipo` × `superfície` × `mídia` × `densidade` × `estado`, 36 variants: base, clickable and section, each elevated and outlined; default and loading on all; hover, focus and disabled on the clickable; compact on the three types; top, inset top and side media on base and clickable. Booleans: `início#4536:0` (on), `descrição#4536:37` (on), `status#4536:74` (off), `ação no header#4536:111` (off), `seção tonal#4536:148` (off), `rodapé#4536:185` (on), `divisória#6479:0` (on). Default variant `6478:6674`. |
| nph-card start set (`nph-card / início`) | `6478:7282` | `tipo` (`ícone` icon, default; `avatar`; `imagem` image) × `tamanho` (`padrão` default, `compacto` compact), 6 variants. Use only inside the nph-card, through the start property. |

## Tokens

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `card/background` | `color/card` | `core/base/white` | `core/surface/800` | Card background, hover too |
| `card/foreground` | `color/card-foreground` | `core/neutral/950` | `core/neutral/100` | Title, content, tonal section text, list value |
| `card/description-foreground` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Description, tonal section label, list key, meta footer of the clickable |
| `card/border` | `color/border-subtle` | `core/neutral/50` | `core/alpha/white-10` | 1 px outline, both surfaces |
| `card/divider` | `color/border-subtle` | `core/neutral/50` | `core/alpha/white-10` | Divider before the footer actions (the nph-separator line, overridden) |
| `card/border-hover` | `color/border` | `core/neutral/200` | `core/surface/400` | Outline of the clickable card in hover |
| `card/border-width` | `border/width` | 1 | 1 | Outline and divider thickness |
| `card/radius` | `radius/surface` | 14 | 14 | Card corner |
| `card/padding` | `space/surface-padding` | 24 | 24 | Body padding, default density |
| `card/padding-compact` | `space/container-padding` | 16 | 16 | Body padding, compact density |
| `card/gap` | `space/stack` | 16 | 16 | Between header, content and tonal section |
| `card/header-gap` | `space/stack-snug` | 8 | 8 | Between title and description |
| `card/header-item-gap` | `space/inline` | 8 | 8 | Between start, title, status and action in the header; between title and status |
| `card/section-background` | `color/muted` | `core/surface/50` | `core/surface/700` | Tonal section |
| `card/section-radius` | `radius/inset` | 8 | 8 | Tonal section corner |
| `card/section-padding` | `space/container-padding` | 16 | 16 | Tonal section padding |
| `card/section-gap` | `space/stack-snug` | 8 | 8 | Between label and text of the tonal section |
| `card/list-gap` | `space/stack-snug` | 8 | 8 | Between the rows of the key-value list (section type) |
| `card/footer-gap` | `space/inline` | 8 | 8 | Between the footer actions |
| `card/footer-padding` | `space/surface-padding` | 24 | 24 | Around the footer actions, default density |
| `card/footer-padding-compact` | `space/container-padding` | 16 | 16 | Around the footer actions, compact density |
| `card/disabled-opacity` | `state/disabled-opacity` | 0.5 | 0.5 | The whole disabled clickable card |
| `card/icon-container-background` | `color/primary-surface` | `theme/brand-50` | `theme/brand-900` | Tonal box of the start icon |
| `card/icon-container-foreground` | `color/primary-on-surface` | `theme/brand-600` | `theme/brand-100` | Icon on the tonal box |
| `card/icon-container-radius` | `radius/inset` | 8 | 8 | Corner of the icon box |
| `card/icon-container-padding` | `core/space/200` | 8 | 8 | Padding of the icon box (straight to the core, by decision) |
| `card/icon-size` | `icon/size-lg` | 24 | 24 | Start icon, default density |
| `card/icon-size-dense` | `icon/size-sm` | 16 | 16 | Start icon, compact density |
| `card/indicator-size` | `icon/size-sm` | 16 | 16 | Arrow (chevron-right) of the clickable card |
| `card/indicator-foreground` | `color/card-foreground` | `core/neutral/950` | `core/neutral/100` | Arrow color of the clickable card (today the nph-icon default is `color/foreground`; the card overrides it) |

`card/border-raised` and `card/background-hover` never became tokens: the old two-stroke patch and the hover by background left with items 2 and 3.

### Used directly or by instance

- Focus of the clickable card: border `focus/border` with thickness `border/width` and corner `focus/border-radius-surface` (15), outside the card; halo `focus/halo` with thickness `focus/ring-width` and corner `focus/radius-surface-with-border` (19), beyond the border. The border carries the 3:1; the halo is decoration.
- Elevation: the elevated surface has `elevation/raised`; in dark the shadow color goes to 0% (`shadow/color`) and the card background, one step above the page, separates it with the outline. The outlined surface has no shadow.
- Text styles: title `text/heading-md` (compact `text/heading-xs`); description, tonal section label, list key and value and meta footer `text/body-sm`; content and tonal section text `text/body-md`.
- Pieces by instance, with their own tokens: nph-avatar (`lg` 40 px, compact `md` 32 px), nph-image (start 48 px `image/size-md`, compact 32 px `image/size-sm`; media `image/radius-lg` when inset), nph-badge (secondary light status), nph-button (secondary solid and primary solid actions, `control/height-default`; section header action secondary solid compact), nph-icon-button (ghost compact menu action, `control/height-compact`), nph-separator (divider; its line overridden to `card/divider`), nph-skeleton (loading), nph-icon (start icon and arrow).

## Anatomy, read part by part in Figma

Read by script, variant by variant, after the token bindings (17-11).

1. **Surface**: background `card/background`, corner `card/radius`, 1 px outline (`card/border-width`) in `card/border`, both themes and both surfaces; the elevated adds `elevation/raised`, the outlined has no shadow. It holds the parts from top to bottom, all the card width, aligned to the start: media, body and footer. In Figma the outline is drawn twice (one layer for light, one for dark, both in `card/border`): a Figma patch; in code it is one outline.
2. **Media**: nph-image the card width, at the top, in 16:9, clipped by the card to `card/radius` at the top corners (the variant clips its content); inset (inside the body padding, corner `image/radius-lg`); or on the side, at the left, with the card height and about 40% of the card width (33% in the compact density), cover crop; on a narrow container the side media moves to the top. Off by default.
3. **Body**: padding `card/padding` (24) in the default density and `card/padding-compact` (16) in the compact one. Stacks header, content and tonal section, gap `card/gap`, aligned to the start.
4. **Start**: the `nph-card / início` instance, first piece of the header, centered on the header height: a 40 px box (padding `card/icon-container-padding`, corner `card/icon-container-radius`, background `card/icon-container-background`) with a 24 px icon (`card/icon-size`) in `card/icon-container-foreground`; or nph-avatar of 40 px; or nph-image of 48 px. Compact: 32 px for the three, icon `card/icon-size-dense`. On by default.
5. **Title and status**: on the title row, after the start, taking the remaining space: title in `text/heading-md` and `card/foreground`, one line, with an ellipsis when it does not fit; the status (nph-badge secondary light) sits next to the title, `card/header-item-gap` away, centered on the row, and the title truncates before it (the status never hides). Compact: `text/heading-xs`. Status off by default.
6. **Description**: below the title, `card/header-gap` away, aligned to the start: `text/body-sm` in `card/description-foreground`. On by default.
7. **Header action** (off by default): the last piece of the header, centered on its height: on the base type, the nph-icon-button ghost compact of 28 px with the `ellipsis-vertical` icon; on the section type, the nph-button secondary solid compact, with text. On the clickable type, in its place, the `chevron-right` arrow of 16 px (`card/indicator-size`) in `card/indicator-foreground`, decorative, always shown (it has no boolean).
8. **Content**: text in `text/body-md` and `card/foreground`, the body width, aligned to the start. On the section type, a key-value list in `text/body-sm`, rows `card/list-gap` apart, key at the start and value at the end of the row.
9. **Tonal section**: a band in `card/section-background` the body width, corner `card/section-radius`, padding `card/section-padding`, label and text `card/section-gap` apart, no border and no shadow; aligned to the start. Off by default; absent on the clickable.
10. **Divider**: nph-separator horizontal, edge to edge, at the top of the footer, right above the actions: 1 px line (`card/border-width`) in `card/divider`. On by default, shown only when the action footer is on; the clickable has none. Drawn twice in Figma (light and dark layers), one in code.
11. **Footer**: on the base and the section types, actions aligned to the end, secondary before primary: nph-button secondary solid and primary solid, `card/footer-gap` apart, with `card/footer-padding` around (compact `card/footer-padding-compact`). On the clickable, the footer is a meta text in `text/body-sm` and `card/description-foreground`, aligned to the start, inside the body, with no divider.
12. **Loading** (`estado=carregando`, on every type): the surface, its outline and the body padding stay; the content becomes nph-skeleton pieces, `aria-hidden`. Header: a 40 px skeleton in the start place (`avatar/size-lg`, `avatar/radius-lg`, `color/muted`), and a title line (264 × 16) and a description line (160 × 16), `card/header-gap` apart (`skeleton/line-height`, `radius/inner`, `color/muted`); no status, no header action, no arrow. Content: two lines (312 × 16 and 200 × 16), `card/gap` below the header. On the base and the section types the footer stays, with the divider and one action skeleton (120 × 36, `radius/control`) inside `card/footer-padding`; the clickable has no footer while loading. Widths are from the 360 px example; the lines follow the card width.

Order and alignment (appendix G, read in the set: header horizontal with center alignment; actions aligned to the end; list rows with space between): media, body and footer stacked; on the side media, media at the left and body and footer in a column at the right. Header: start, title and description, action (or arrow); the title and description take the remaining space.

Widths in Figma are examples, with no token: base 360, compact 320, side media 560. The card takes the width of its container.

## Assembly model

For whoever builds a new card, a person or an AI. Besides the container, only the title is required; the other zones turn on and off. An assembly is not a variant: profile, file, product and form are the same nph-card with the free content filled in. The zones have their own numbering, different from the anatomy.

| Zone | Required | Accepts | Nephos piece | Rule | Name in code |
|---|---|---|---|---|---|
| 1 container | yes | elevated or outlined | nph-card | soft outline on both; shadow only on the elevated | `root` |
| 2 media | no | top, inset top or side | nph-image | one per card; it is not the start | `media` |
| 3 start | no | icon, avatar or image | nph-card start set (nph-icon, nph-avatar or nph-image) | one piece at a time | `leading` |
| 4 title | yes | text | — | one line; a long title truncates with an ellipsis before the status | `title` |
| 5 status | no | badge | nph-badge light | next to the title | `status` |
| 6 action | no | menu icon or button with text; on the clickable, only the arrow (decorative) | nph-icon-button ghost or nph-button secondary; on the clickable, nph-icon `chevron-right` | opens a menu or runs the action; the clickable has no action: the arrow takes no focus | `action` |
| 7 description | no | short text | — | `card/description-foreground`, below the title | `description` |
| 8 free content | no | text, list, fields or metrics | Nephos pieces | never a card inside another | `content` |
| 9 tonal section | no | highlighted passage | — | background `card/section-background`, no divider inside | `section` |
| 10 divider | no | line | nph-separator | before the action footer; turns on and off | `divider` |
| 11 footer | no | actions or meta | nph-button or text | actions aligned to the end; the meta footer has no divider | `footer` |

The code names follow the shadcn `data-slot` where it has the part (`title`, `description`, `action`, `content`, `footer`); `root`, `media`, `leading`, `status`, `section` and `divider` are Nephos names (item 18).

Assemblies and the zones they turn on: header only (1, 3, 4, 5, 6, 7); with avatar (1, 3 avatar, 4, 5, 6, 7); app card (1, 3, 4, 5, 6, 7, 8, 10, 11); arrow and meta (1, 3, 4, 6 arrow, 7, 8, 11 meta); top media (1, 2, 4, 7, 10, 11, no action over the media); side media (1, 2 side, 4, 5, 7, no divider and no tabs); profile (1, 3 avatar, 4, 7, 10, 11); file (1, 3, 4, 6, 7); product (1, 2, 4, 7, 8 price, 10, 11); in a form (1, 4, 7, 8 fields, 10, 11). No assembly turns on the tonal section.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Title (`card/foreground`) and description (`card/description-foreground`) pass 4.5:1 over the card in both themes, also over the tonal section. The start icon (`card/icon-container-foreground`) passes 3:1 over its box (`card/icon-container-background`) in every brand and both themes (4.64:1 or more). The outline (`card/border`) is decorative: the background and the shadow separate the card from the page. |
| Visible focus | The clickable card in focus shows the `focus/border` border (`border/width`, corner 15) and, beyond it, the `focus/halo` halo (`focus/ring-width`, corner 19), around the whole card. The border carries the contrast, over `color/background`: 5.37:1 in light in the default brand and 4.32:1 or more in every brand; 11.7:1 in dark in the default brand. The halo is decoration. |
| Color is not the only cue | The clickable card shows the arrow in the header and the meta text in the footer, not only the hover outline. The status carries text in the nph-badge, not only color. |
| Target size | On the clickable card, the whole card is the link area. On the base type, the header action is 28 × 28 px (`control/height-compact`), above the 24 × 24 px of WCAG 2.5.8; on a touch screen it becomes 36 px (`control/height-default`) (item 14). |
| Accessible name | On the clickable card the link is on the title and the name read is the title; start and arrow are decorative (`aria-hidden`), because the title already says the subject. On the base type, the icon-only header action has an `aria-label` with the verb and the card title, such as "More options for Order 1042". |
| Disabled | The disabled clickable card takes `card/disabled-opacity` and leaves the focus order. An inactive component is outside the contrast requirement (WCAG 1.4.3). |

Measured (appendix and approval items): the soft outline over the card is about 1.1:1 in light and 1.35:1 in dark, decorative; the hover outline over the card is 1.69:1 to 3.53:1, and the hover needs no 3:1 because the pointer is the cue; the start icon box over the card is 1.04:1 to 1.25:1 in dark, decorative (WCAG 1.4.11), and the icon carries the cue.

## Properties, variants and states

| Field | Rule |
|---|---|
| type | base: a card with its own content and actions. clickable: the whole card leads to a destination, with the arrow and a meta text footer, no buttons, no header action, no tonal section and no divider. section: a block of data of a detail page, with a key-value list and, when on, a header action with text. |
| surface | elevated (default): outline `card/border` and shadow `elevation/raised`; in dark the shadow goes away and the card background separates it with the outline. outlined: the same outline, no shadow. Use the outlined inside another surface or in a dense list. |
| media | none; top (the card width, 16:9); inset top (inside the body padding); side (at the left, the card height and about 40% of the width, 33% compact, in a wider card; on a narrow container it moves to the top). On base and clickable. The start thumbnail is not media. |
| density | default: padding 24, title `text/heading-md`, start 40 px (image 48 px). compact: padding 16, title `text/heading-xs`, start 32 px, for a dense list and a narrow panel. |
| state | default and loading on every type; hover, focus and disabled only on the clickable. Hover: the outline rises to `card/border-hover`; background and shadow stay. Loading swaps the content for nph-skeleton. |
| parts that turn on | start, description, footer and divider on by default; status, header action and tonal section off. The divider shows only with the footer on. Header action and tonal section do not exist on the clickable nor on loading; the clickable has no divider. |
| start | swaps its piece in the start instance: `tipo=ícone` (default), `avatar` or `imagem`; `tamanho=padrão` or `compacto`, matching the card density. One piece at a time. |
| not a property | A divider between the body parts: the card separates by space, and the only divider is the one of the action footer. An assembly (profile, file, product, form) is free content, not a variant. Choosing one among several is the nph-rich-option; opening and closing content is the nph-collapsible. |

## Relations and context

| Piece | Rule |
|---|---|
| nph-button | In the footer, at most one main action (primary solid); the others in secondary solid. On the section type, the header action is a secondary solid compact button with text. Color, state and focus come from the button. |
| nph-icon-button | Header action of the base type: ghost compact with the `ellipsis-vertical` icon, for more options; it opens a menu. Focus and icon weight change come from the button. |
| nph-badge | Status in the header, light emphasis. |
| nph-image | Media at the top, inset or at the side; and the start thumbnail, 48 px (32 px compact). |
| nph-avatar | Start with a person: `lg` 40 px (`md` 32 px compact), with a photo or the `user` icon; the outline is the avatar's own. |
| nph-separator | The divider before the footer actions, horizontal, edge to edge, line in `card/divider`; on by default when the footer has actions. |
| nph-skeleton | Loading state, in place of the content. |
| nph-icon | Start icon and arrow of the clickable card. |
| space | Inside the card, `card/gap` between the body parts and `card/header-item-gap` between the header pieces. Each piece by instance keeps its own focus; the card draws focus only on the clickable type. |

## When to use

- Base: a summary or item with its own actions, such as open or approve. On one card, choose between actions inside or the whole card clickable.
- Clickable: an item of a collection that leads to another page, with nothing interactive inside.
- Section: a block of data of a detail page, with one action such as edit in the header.
- Elevated over the page background; outlined inside another surface or in a dense list.
- Compact density in a dense list or narrow panel; default elsewhere.
- Media at the top when the image identifies the item; side when the text is the main thing and the image supports it.
- Start with an icon for the kind of subject, an avatar for a person and an image for an object or file.
- Divider when the footer has actions; the meta footer of the clickable card has no divider.

## Required examples (in Figma, light and dark)

1. Summary with actions: base elevated, with status, tonal section, divider and one main action in the footer. 2. Navigable collection: clickable with top media. 3. Detail block in a panel: section outlined, with a header action. 4. Profile: base with an avatar with a photo in the start. 5. File: base outlined with a thumbnail in the start and the menu action, no footer.

## Do

- Use at most one main action in the footer, because it says the next step of the subject.
- Keep the link of the clickable card on the title, because the name read by the screen reader comes from it.
- Separate the body parts by space and keep the only divider before the footer actions, because a divider in each part weighs the card down.
- Group related data in the tonal section, because the background separates without adding lines.
- Use the same surface and density in the cards of a grid, because a difference looks like hierarchy.
- Use the start to say what the card is: icon for the category, avatar for a person and image for an object, because the person recognizes the kind before reading the title.

## Do not

- Do not put two main actions in the footer — use one primary solid and the others in secondary solid: two main actions compete for the next step.
- Do not put a destructive action in the header action — use a button with text in the footer: the loose icon in the corner gets tapped by mistake.
- Do not use a generic title on the clickable card — write the destination in the title: the name read by the screen reader is the title.

## Default behavior (appendix C, accepted with the documentation)

There is no "card" pattern in the WAI-ARIA APG: the base is the link pattern (clickable), the menu button pattern (menu action) and what the accessibility sources on cards say.

| Situation | What happens | Source |
|---|---|---|
| Tab on the base card | Stops only on the inner controls (menu action and footer buttons). The card takes no focus. | https://primer.style/product/components/card/accessibility/ |
| Tab on the clickable card | One stop, on the title link (item 19a); the clickable card has no control inside (only the decorative arrow). | https://inclusive-components.design/cards/ · https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html · https://carbondesignsystem.com/components/tile/usage/ |
| Enter and Space on the clickable | Enter opens the link. Space does nothing: it is a link, not a button. | https://www.w3.org/WAI/ARIA/apg/patterns/link/ |
| Click anywhere on the clickable | The title link, stretched with CSS only, covers the card; no text selection script in v1 (item 19b). | https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html |
| Control inside the clickable | None: the menu action stays on the base, the text button in the section header and the footer buttons on both (item 14). | https://carbondesignsystem.com/components/tile/usage/ |
| Menu action | Menu button: Enter, Space or Down Arrow open the menu and focus the first item; Up Arrow focuses the last. | https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ |
| Escape in the action menu | Closes the menu and returns focus to the menu action. | https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ |
| Name of the menu action | Carries the card context: "More options for" + the title. | https://primer.style/product/components/card/accessibility/ |
| Focus when opening and closing | Does not apply: the card does not open. The action menu follows the APG menu button. | https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ |
| Pointer and focus | The hover only paints the outline (`card/border-hover`); it does not move focus. Visible focus draws the border and halo around the whole card. | https://inclusive-components.design/cards/ |
| Near the window edge | Does not apply: the card does not float. The action menu flips when it does not fit. | https://floating-ui.com/docs/flip |
| Loading | `aria-busy="true"` on the card and the skeleton with `aria-hidden="true"`, back to false when done; plus a hidden text "Loading" (translated) outside the hidden node, because only one screen reader honored `aria-busy` in the Roselli test (item 19c). | https://adrianroselli.com/2020/11/more-accessible-skeletons.html |
| Disabled clickable | Removes the `href`, sets `role="link"` and `aria-disabled="true"`; leaves the focus order; opacity `card/disabled-opacity`. | https://www.scottohara.me/blog/2021/05/28/disabled-links.html |
| Section type | The card becomes a region (`section`) with `aria-labelledby` pointing to the title. | https://github.com/primer/react/blob/main/packages/react/src/Card/Card.tsx |
| Collection of cards | A list (`ul` and `li`) with a name on the list; the APG feed pattern only for infinite scroll. The card title is a heading with the link inside, level configurable, `h3` by default (item 19d). | https://inclusive-components.design/cards/ · https://primer.style/product/components/card/ |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Combined states (T11)

The single Nephos rule (selected or checked + disabled keeps the selection mark under the disabled opacity; error + disabled: disabled wins) does not apply to the nph-card today: it has no selected, checked or error state (selection is the nph-rich-option). The only combination is hover or focus + disabled on the clickable card: disabled wins and it leaves the focus order.

## Icon and image

| Piece | Weight and size | Rule and source |
|---|---|---|
| start icon (`folder` in the example) | `light`; 24 px `card/icon-size` default, 16 px `card/icon-size-dense` compact | Always `light`, no swap in hover: the card hover changes only the outline. Chosen by the kind of subject, only from Font Awesome through nph-icon. https://fontawesome.com/icons/folder?s=light |
| menu action (`ellipsis-vertical`) | `light` at rest, focus without hover and disabled; `solid` in hover and active; 16 px inside the 28 px compact nph-icon-button | follows DSA-47 D1, by instance. https://fontawesome.com/icons/ellipsis-vertical?s=light |
| arrow of the clickable (`chevron-right`) | `light`; 16 px `card/indicator-size`, color `card/indicator-foreground` | The same in every state (the hover changes only the outline). https://fontawesome.com/icons/chevron-right?s=light |
| avatar without photo (`user`) | `light`; the nph-avatar size: `lg` 40 px with the icon at 24 px, `md` 32 px with the icon at 20 px | follows DSA-24 D1 and D2, by instance. |
| start thumbnail (nph-image) | 48 × 48 px (`image/size-md`) default, 32 × 32 px (`image/size-sm`) compact; square cover crop | Export at 2x (96 × 96 px and 64 × 64 px), cover crop centered (item 12). https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images |
| top and inset top media (nph-image) | the card width in 16:9 (360 × 203 px and 312 × 176 px in the example) | Export at 2x of the largest width in use (720 × 405 px), cover crop (item 12). |
| side media (nph-image) | about 40% of the card width (33% compact), the card height (200 × 241 px in the example) | Free proportion with cover crop and focus at the center; export at 2x of the largest side width (400 px in the example); moves to the top on a narrow container, as the Polaris media card (item 12). https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/MediaCard/MediaCard.module.css |

## Limits (the six cases of the matrix)

- Minimum: compact, title only.
- Maximum: everything on.
- Long text: the title truncates with an ellipsis before the status, which never hides (item 18).
- Empty: no content, with the title (the title is the only required zone).
- Many items: does not apply; the card has no list of its own. A long list goes in the free content, with the list piece, and the page scrolls.
- Short window: does not apply; the card does not float. Its height grows with the content and the page scrolls; its width comes from the container.

## Inherited decisions

- follows DSA-68 D-1: the optional media slot at the start of the card stays (Radix and shadcn show it with an avatar) — it becomes the start slot.
- follows DSA-24 D1 to D4: avatar without photo with the `user` icon `light`; on the `lg` avatar the icon is `icon/size-lg` (24 px); while the photo loads the icon shows, and if it fails the icon stays; avatar outline in `border/width` and `color/border`, inside, over the photo.
- follows DSA-47 D1, by instance: the nph-icon-button icon swaps to `solid` in hover and active; at rest, focus without hover and disabled it stays `light` (the menu action).
- follows DSA-64 D-1, by instance: secondary solid with no overlap, `button/secondary-solid-background` the same inside and outside the dialog (the secondary footer button).
- does not follow DSA-67 D-4 (popover title in `text/heading-sm`): the card is not a floating layer; the title is `text/heading-md` (compact `text/heading-xs`, item 11).
- does not follow DSA-67 D-1 and D-2 nor DSA-68 D-2, D-3 and D-4 (arrow, trigger, trigger link, collision): the card does not float.
- open and with no effect on the card: DSA-67 D-3, DSA-26 D1 and D2, DSA-24 D5, DSA-78 D-1 to D-3.
- no answered decisions section: DSA-10 (separator), DSA-12 (badge) and DSA-51 (image).

## Decisions answered (test round of 17-11, all as recommended)

1. Documentation `6516:13647` and appendix accepted.
2. Outline and divider: `card/border` and `card/divider` to `color/border-subtle` (light `#F1F1F1`, dark white 10%), the decorative outline of the Material outlined card and of Radix; no new `color/card-border`.
3. Clickable hover: only the outline rises, `card/border-hover` to `color/border`; background and shadow stay (Radix and Fluent change only the outline). `color/border-strong` would be too strong for the soft style.
4. Start icon box: `color/primary-surface` with `color/primary-on-surface` (the Material primary container pair for an element of lower emphasis).
5. Focus radii: `focus/border-radius-surface` (15) and `focus/radius-surface-with-border` (19), with the primitives `core/radius/off-scale/15` and `/19`; they close the focus family that exists for control and inner piece.
6. Footer: padding 24 (`card/footer-padding`), 16 compact (`card/footer-padding-compact`), 8 between buttons (`card/footer-gap`), as shadcn and Chakra; not the popover footer.
7. Card padding: new semantic `space/surface-padding` (24); raising `space/container-padding` would change popover, panel and dialog.
8. Fitted radius: new semantic `radius/inset` (8) for the tonal section and the icon box; raising `radius/inner` would round the checkbox. `radius/inner` drops "icon with background". Declared deviation from item 8, for the design owner to check: the item asked to drop "thumbnail" too, but it stays, because `image/radius-sm` and `table/thumbnail-radius` use `radius/inner` in the code.
9. Icon box padding straight to the core (`core/space/200`): no semantic has the function, one consumer.
10. Start image 48 px (`image/size-md`): the nph-image has no 40 px.
11. Title `text/heading-md`, compact `text/heading-xs`, as the `design.md` use of those styles.
12. Media and export (see "Icon and image").
13. The nph-collapsible card appearance moves to `color/border-subtle` in its own next adjustment, not in this task (still open in the Figma appendix until that adjustment; nothing for this task).
14. Nothing interactive inside the clickable card; the menu action is 28 px, 36 px on touch.
15. The divider is a boolean, on by default when the footer has actions; the meta footer has none.
16. Out of v1: shadow only, filled or tonal, subtle, primary and secondary emphasis, collection or gallery (it is layout), card with tabs, nested card, card in a grid, sizes (the width comes from the layout), draggable, pressed, selectable and selected (they are the nph-rich-option), expandable (it is the nph-collapsible).
17. Assembly model: numbered zones, assemblies in skeleton and the two tables, no native Figma slot until the Figma MCP reads slots.
18. Names: elevated and outlined (Material Elevated and Outlined); the slot is "start" (`leading` in code); the long title truncates before the status; code slot names as in the zone table.
19. Default behavior: (a) one Tab stop on the clickable card, the title link; (b) the stretched link with CSS only, no selection script in v1; (c) loading with `aria-busy`, skeleton `aria-hidden` and a hidden "Loading" text; (d) a collection is a `ul`/`li` list with the card title as a heading, `h3` by default, configurable.
20. Design file only: the old root and the 05-11 set stay until their outside instances are replaced (still open in the Figma appendix; nothing for this task).
21. Decision map: the nph-card and the nph-image are in v1.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1626:28`, documentation frame `6516:13647`, root `6478:6670`, appendix `6523:17387`
- Component sets: nph-card `6478:6673`; nph-card start set `6478:7282`
- WAI-ARIA APG, Link: https://www.w3.org/WAI/ARIA/apg/patterns/link/
- WAI-ARIA APG, Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- Inclusive Components, Cards: https://inclusive-components.design/cards/
- Adrian Roselli, Block Links, Cards, Clickable Regions: https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
- Adrian Roselli, More Accessible Skeletons: https://adrianroselli.com/2020/11/more-accessible-skeletons.html
- Carbon, Tile usage: https://carbondesignsystem.com/components/tile/usage/
- Primer, Card: https://primer.style/product/components/card/
- shadcn card: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/card.tsx
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- `design.md` — the tokens named in this evidence
