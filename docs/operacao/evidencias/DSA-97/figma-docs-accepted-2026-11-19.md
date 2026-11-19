```json
{
  "task": "DSA-97",
  "gate": "figma-docs-accepted",
  "date": "2026-11-19",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7428-43770",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-accordion (green page 1626:29, root 7227:25867), and its documentation frame (7428:43770) was accepted, with COMPONENT_SET nph-accordion (7227:26169), the item set (7227:26332) and the start set (7227:26993). On the approval page of 2026-11-19 the design owner approved items 1 to 9 and 11, all as recommended: (1) documentation 7428:43770 accepted; (2) accordion/title-gap straight to core/space/50 (2 px) by decision, with a declared deviation; (3) accordion/tile-padding and accordion/tile-padding-compact straight to core/space/200 and core/space/100 by decision; (4) accordion/divider-spacing on space/inline-tight (4 px), with a declared deviation; (5) accordion/border and accordion/divider on color/border-subtle, and the descriptions of color/border-subtle and color/border name the accordion; (6) accordion/tile-background on color/primary-surface, accordion/status-pending-icon on color/muted-foreground and accordion/tile-icon-size-large on icon/size-lg, with the accordion written into the description of each semantic; (7) the start media, the tag and the end status move to the nph-collapsible in an adjustment of its own, and until then the accordion keeps its own item; (8) in that adjustment collapsible/title-gap goes from 8 to 2 px; (9) closed content uses hidden=until-found; (11) four technical points: short description inside the button, start image exported at 2x, start media decorative, open and disabled only for a whole locked section. Item 10 (a line of the design owner's taste notes) had no answer and is not part of this task."
  }
}
```

# DSA-97 — `figma-docs-accepted`

The documentation of the nph-accordion (frame `7428:43770`, page `1626:29`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7227:25867`. The nph-accordion is a list of sections with a title that the person opens and closes to see the content of each one, without leaving the screen. Each item has a trigger with the title and, when the section needs it, media at the start, a tag next to the title, a status at the end and the indicator. The accordion holds the items in a container, with the divider and the opening rule between them.

Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New group `accordion/*`, 23 tokens. 20 alias semantics (rule 2 of T9). 3 point straight to the core by decision (rule 3 of T9), with no new value in the core:
  - `accordion/title-gap` → `core/space/50` (2), item 2: the gap between the title line and the description of the trigger. `space/stack-tight` (4, "label and field, title and subtitle") and `space/stack-snug` (8) have the function but not the 2 px the design owner asked for; `radius/subtle` (2) is the radius of a small marker, not a space. A declared deviation from the half-step rule of `design.md` (`meio_passo_use`, anti-pattern A28), now written there. It leaves when the `nph-collapsible` adjustment brings `collapsible/title-gap` to 2 (items 7 and 8).
  - `accordion/tile-padding` → `core/space/200` (8) and `accordion/tile-padding-compact` → `core/space/100` (4), item 3: the padding inside the start tile. No semantic token is the inner padding of a small piece; the semantics of 4 and 8 are gaps between pieces (`space/inline-tight`, `space/stack-tight`, `space/inline`, `space/stack-snug`), radii (`radius/inner`, `radius/container`, `radius/inset`) or focus (`focus/ring-width`, `focus/radius-inner`).
- Two declared deviations on aliases: `accordion/divider-spacing` → `space/inline-tight` (item 4; the Nephos already uses it vertically between list rows: `navigation-menu/group-gap`, `panel-menu/item-gap`); `accordion/border` and `accordion/divider` → `color/border-subtle` (item 5).
- Two declared extensions of function and one exception (item 6): `accordion/tile-background` → `color/primary-surface` (the tile is a decorative mark, not an action); `accordion/status-pending-icon` → `color/muted-foreground` (there is no `status/pending`); `accordion/tile-icon-size-large` → `icon/size-lg`, with an exception to its "DO NOT USE in a list".
- No semantic changed value. Six descriptions changed, mirrored in `design.md`: `color/border-subtle` (it names the outline and the divider of the accordion), `color/border` (the accordion joins its DO NOT USE), `core/space/50` (the accordion gap, in `direto_por_decisao` and in the half-step rule), `color/primary-surface` (the start tile), `color/muted-foreground` (the pending status icon) and `icon/size-lg` (the exception for the large tile).
- `design.md`: the `use` of every semantic these tokens alias now names the accordion (`color/card`, `border/width`, `radius/surface`, `space/container-padding`, `space/inline-tight`, `space/stack`, `space/inline`, `color/primary-on-surface`, `radius/inset`, `icon/size-sm`, `status/success`, `status/warning`, `status/error`, `elevation/raised`), and the two rule lines on the soft border ("Border and shadow together", "Known limitation") name it too.

## Purpose

A list of sections with a title that the person opens and closes to see the content of each one, without leaving the screen. Open, the content pushes down what comes below and covers nothing.

Choice: the appearance (grouped, separated or flush) by the place on the screen, the expansion (multiple or single) by the task and the size (default, compact or large) equal to the other controls of the screen. In each item: title, description, start (icon, tile, avatar, image or status icon), tag, end (status), indicator, open and state.

Use it when the screen has several supporting sections and the person reads one or a few at a time: the details of a record, frequently asked questions, filters in a side panel, the steps of a setup. It does not replace the `nph-tabs` (sections of the same weight seen one at a time), the `nph-collapsible` (a single section, with no rule between items) or the content everybody needs to read: the essential stays open on the page. Errors, warnings and a pending required field are not hidden in a closed item; show the pending item in text, in the item description (for example "2 fields left") or in the end status.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| `nph-accordion` | `7227:26169` | The accordion, 18 variants: appearance (`agrupado` grouped, `separado` separated, `flush`) × expansion (`múltipla` multiple, `única` single) × size (`padrão` default, `compacto` compact, `grande` large). Defaults: grouped, multiple, default. |
| `nph-accordion / item` | `7227:26332` | The item, 48 variants: size (compact, default, large) × open (no, yes) × state (default, hover, focus, disabled) × indicator (end, start). Properties: title (text), description (boolean, off) and description text, start (boolean, off), tag (boolean, off), end (boolean, off). |
| `nph-accordion / início` (start set) | `7227:26993` | The start media, 24 variants: type (icon, tile, avatar, image, status success, status warning, status error, status pending) × size (compact, default, large). It follows the size of the item. |

Root `7227:25867`, documentation `7428:43770`, appendix `7428:44347`. Pieces by instance: `nph-icon` `248:143`, `nph-badge` `878:30`, `nph-avatar` `1434:29`, `nph-image` `2573:66089`, `nph-separator` `762:2`.

## Tokens

Light and dark values are read in the `Sistemas` brand; `color/primary-surface` and `color/primary-on-surface` follow the active brand.

### `accordion/*`

| Token | Alias | Light · dark | Where the piece uses it |
|---|---|---|---|
| `accordion/background` | `color/card` | #FFFFFF · #1E2228 | Background of the grouped container and of each separated block; the flush has no background. |
| `accordion/border` | `color/border-subtle` | #F1F1F1 · white 10% | Outline of the grouped container and of each separated block (item 5). |
| `accordion/border-width` | `border/width` | 1 · 1 | Thickness of that outline. |
| `accordion/radius` | `radius/surface` | 14 · 14 | Corner of the grouped container and of each separated block. |
| `accordion/padding` | `space/container-padding` | 16 · 16 | Padding of the grouped container and of each separated block, on the four sides. |
| `accordion/divider` | `color/border-subtle` | #F1F1F1 · white 10% | Color of the divider line between items, grouped and flush (item 5). |
| `accordion/divider-spacing` | `space/inline-tight` | 4 · 4 | Gap above and below the divider, grouped and flush (item 4). |
| `accordion/item-gap` | `space/stack` | 16 · 16 | Gap between the separated blocks. |
| `accordion/media-gap` | `space/inline` | 8 · 8 | Gap after a start tile, avatar or image, before the title. |
| `accordion/tag-gap` | `space/inline` | 8 · 8 | Gap between the title and the tag, on the title line. |
| `accordion/title-gap` | `core/space/50`, by decision | 2 · 2 | Gap between the title line and the description, in the three sizes (item 2). |
| `accordion/end-gap` | `space/inline` | 8 · 8 | Gap between the end status and the indicator. |
| `accordion/tile-background` | `color/primary-surface` | #EBF2FE · #0C1A31 | Background of the start tile (item 6). |
| `accordion/tile-foreground` | `color/primary-on-surface` | #2F68C5 · #D8E6FD | Icon inside the start tile. |
| `accordion/tile-radius` | `radius/inset` | 8 · 8 | Corner of the start tile, four corners. |
| `accordion/tile-padding` | `core/space/200`, by decision | 8 · 8 | Padding of the start tile, default and large (item 3). |
| `accordion/tile-padding-compact` | `core/space/100`, by decision | 4 · 4 | Padding of the start tile, compact (item 3). |
| `accordion/tile-icon-size` | `icon/size-sm` | 16 · 16 | Icon of the start tile, compact and default. |
| `accordion/tile-icon-size-large` | `icon/size-lg` | 24 · 24 | Icon of the start tile, large (item 6). |
| `accordion/status-success-icon` | `status/success` | #12823B · #45B56E | Start icon of the type status success. |
| `accordion/status-warning-icon` | `status/warning` | #BB460A · #EE793D | Start icon of the type status warning. |
| `accordion/status-error-icon` | `status/error` | #B01E1E · #EA7D7D | Start icon of the type status error. |
| `accordion/status-pending-icon` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Start icon of the type status pending (item 6). |

The tile is 24, 32 and 40 px by size: 16 of icon plus 4 + 4 in compact, 16 plus 8 + 8 in default, 24 plus 8 + 8 in large.

### Used directly or by instance, with no `accordion/*` token

- **Item, until the `nph-collapsible` adjustment (items 7 and 8):** the accordion item binds the `collapsible/*` tokens of the `nph-collapsible` straight: `collapsible/trigger-height`, `-height-compact`, `-height-large`; `collapsible/trigger-padding-x`, `-padding-y`, `-padding-y-compact`; `collapsible/trigger-gap`, `collapsible/trigger-radius`, `collapsible/trigger-background-hover`; `collapsible/title-foreground`, `collapsible/description-foreground`; `collapsible/indicator-size`, `collapsible/indicator-foreground`, `collapsible/icon-size`, `collapsible/icon-foreground`; `collapsible/content-padding-x`, `-padding-top`, `-padding-bottom`, `collapsible/content-gap` (the content text in `color/foreground`); `collapsible/disabled-opacity`; `collapsible/focus-border`, `-focus-border-width`, `-focus-border-radius`, `collapsible/focus-halo`, `-focus-halo-width`, `-focus-halo-radius`; and, in code, the motion `collapsible/expand-duration` and `collapsible/expand-easing` (Figma binds no motion token). A temporary exception to T9 (token of another piece), until the adjustment of item 7: there the slots return to the `nph-collapsible`, and the media, tag and status `accordion/*` become `collapsible/*`, with the same semantics, and `accordion/title-gap` leaves.
- **Tag and end status:** `nph-badge` light, with its own tokens (among them `radius/full`, `color/primary-surface`, `status/success-surface`, `status/success-foreground`).
- **Avatar and image:** the `avatar/*` and `image/*` tokens of those pieces. The avatar with no photo shows the person in `icon/size-md`, from the piece itself. The 24 and 32 px image keeps radius 4 (`image/radius-sm` → `radius/inner`; DSA-88 decision 8 keeps the thumbnail on `radius/inner`; only the tile moved to `radius/inset`).
- **Divider:** the `nph-separator`. The thickness and the height of the line stay in `border/width` (1), from the separator itself; only the line color is the accordion's (`accordion/divider`). See "What the accordion asks of other pieces".
- **Grouped shadow:** the effect style `elevation/raised` straight (`shadow/color`, black 10% light and 0% dark). Shadow does not become a token; in dark the elevation comes from the `color/card` background. The separated blocks and the flush have no shadow.
- **Width:** the variants are 560 wide (`layout/max-reading`), an example width (DSA-30 D5). In use the accordion stretches to its container; it has no width token.
- **Dark patch:** the outline layers `borda` (light) and `borda (escuro)` (dark) show by `scheme/is-light` and `scheme/is-dark`; in code one outline in `accordion/border` serves both themes.

## Anatomy, read part by part in Figma

Read by script, variant by variant, with the token and the text style of each layer.

### Accordion (`7227:26169`)

- **Grouped** (6 variants): the root has background `accordion/background`, padding `accordion/padding` on the four sides, corner `accordion/radius`, gap `accordion/divider-spacing` between items and dividers, shadow `elevation/raised`, width 560 (`layout/max-reading`, example). Its outline is a layer inside the edge: stroke `accordion/border`, thickness `accordion/border-width`, corner `accordion/radius`. Three items stacked from top to bottom, aligned to the start and to the top, each the full width; a divider between two items, none before the first or after the last.
- **Separated** (6 variants): the root has no background, padding or shadow; three blocks stacked with gap `accordion/item-gap`. Each block has background `accordion/background`, padding `accordion/padding`, corner `accordion/radius` and the same outline (`accordion/border`, `accordion/border-width`); the item fills the block. No divider.
- **Flush** (6 variants): no background, outline or padding; items and dividers with gap `accordion/divider-spacing`.
- **Divider** (24 instances, 2 per grouped and flush variant): a horizontal `nph-separator`, 1 px line (`border/width`, from the separator), color `accordion/divider` by override on the layer `linha`, the width of the item.
- **Indicator in the accordion:** each item draws `chevron-down` light; with multiple expansion the piece shows the first and the second item open; with single, the first.

### Item (`7227:26332`)

- **Trigger:** a horizontal row, minimum height `collapsible/trigger-height-compact` (28), `collapsible/trigger-height` (36) or `collapsible/trigger-height-large` (44) by size; padding `collapsible/trigger-padding-x` (12) on the sides and `collapsible/trigger-padding-y` (8) above and below, `collapsible/trigger-padding-y-compact` (4) in compact; corner `collapsible/trigger-radius`. Parts centered on the vertical axis, in this order: start, text block, end, indicator. With the indicator at the start: indicator, start, text block, end.
- **Hover:** fill `collapsible/trigger-background-hover` on the trigger only (4 variants per size). The pill is inset by the container padding in grouped and separated, and takes the full width in flush. Open does not change the background.
- **Start:** an instance of the start set; padding to its right `collapsible/trigger-gap` (4) with the icon and the status icon, `accordion/media-gap` (8) with the tile, the avatar and the image. It sits centered on the text block, as every part of the trigger is centered on the vertical axis.
- **Text block:** vertical, aligned to the start and to the top; the title line on top and the description below it, gap `accordion/title-gap` (2) in the three sizes. With the indicator at the end, the text block has a right padding of `collapsible/trigger-gap` (4): it is the space before the end status, or before the indicator when there is no status. With the indicator at the start, the text block has no padding: the indicator box carries `collapsible/trigger-gap` to its right and the end carries `collapsible/trigger-gap` to its left (read by script on the 48 item variants).
- **Title line:** horizontal, title and tag centered, gap `accordion/tag-gap` (8). The line becomes 24 px high with the tag (the height of the `nph-badge`); the end status does not change it.
- **Title:** `text/label-md` in compact and default, `text/label-lg` in large; color `collapsible/title-foreground`. A long title wraps (20 px more of height; 24 in large) and the tag stays centered on the two lines.
- **Tag:** `nph-badge` primary light, off by default; the sample text is "New".
- **Description:** `text/body-sm`, color `collapsible/description-foreground`, off by default; sample text "Options few people need to change."
- **End:** the status `nph-badge` light, off by default; the sample shows success with "Done". With the indicator at the end, the end has a right padding of `accordion/end-gap` (8) before the indicator; with the indicator at the start, the end sits at the end of the trigger with a left padding of `collapsible/trigger-gap` (4).
- **Indicator:** `nph-icon` `chevron-down` light at the end (24 variants) or `chevron-right` light at the start (24 variants), size `collapsible/indicator-size` (16), color `collapsible/indicator-foreground` by override; the start one has `collapsible/trigger-gap` after it.
- **Focus** (12 variants, state=focus): two layers in absolute position on the trigger. `borda de foco` (focus border): stroke `collapsible/focus-border`, thickness `collapsible/focus-border-width`, corner `collapsible/focus-border-radius`. `halo de foco` (focus halo), outside it: stroke `collapsible/focus-halo`, thickness `collapsible/focus-halo-width`, corner `collapsible/focus-halo-radius`. The outline layers of the accordion are its container outline, not the focus ring.
- **Disabled** (12 variants): the whole item at opacity `collapsible/disabled-opacity`. The states are exclusive in Figma: a disabled item takes no hover and no focus.
- **Content** (24 variants, open=yes): right below the trigger, with no gap (the item stacks the trigger and the content with 0, so the 8 between them is the top padding); padding `collapsible/content-padding-top` (8) on top, `collapsible/content-padding-x` (12) on the sides, `collapsible/content-padding-bottom` (12) below; the body vertical with gap `collapsible/content-gap`, the sample text in `text/body-md`, `color/foreground` ("Panel content: text, fields or actions. It opens right below the trigger."). The content is a horizontal row: with the indicator at the start, a spacer of `collapsible/indicator-size` (16) and the body, with `collapsible/trigger-gap` (4) between them (20 in all), align the content to the part after the indicator: the title, or the start when there is one. There is no extra indent for the start media (a point that followed the recommendation, see "Decisions answered").

### Start set (`7227:26993`)

| Type | Piece | Size by item size (compact, default, large) | Color and tokens |
|---|---|---|---|
| icon | `nph-icon` `gear` light (default, swappable for any light `nph-icon`) | 16 in all sizes (`collapsible/icon-size`) | `collapsible/icon-foreground`; padding to the right `collapsible/trigger-gap` |
| tile | a box with an `nph-icon` `folder` light (swappable) | 24, 32, 40 | box `accordion/tile-background`, corner `accordion/tile-radius`, padding `accordion/tile-padding-compact` (compact) or `accordion/tile-padding`; icon `accordion/tile-icon-size` (compact, default) or `accordion/tile-icon-size-large` (large), color `accordion/tile-foreground` by override; padding to the right `accordion/media-gap` |
| avatar | `nph-avatar` sm, md, lg, with or without a photo | 24, 32, 40 | the avatar tokens; padding to the right `accordion/media-gap` |
| image | `nph-image` xs, sm, md, ratio 1:1, loaded | 24, 32, 48 | the image tokens; padding to the right `accordion/media-gap` |
| status success, warning, error, pending | `nph-icon` light `circle-check`, `triangle-exclamation`, `circle-xmark`, `clock` | 16 in all sizes (`collapsible/icon-size`) | `accordion/status-success-icon`, `-warning-icon`, `-error-icon`, `-pending-icon` by override; padding to the right `collapsible/trigger-gap` |

### Example texts in Figma (translated in the prose)

Accordion items: "Contract details", "Payments", "Attachments"; content "Contract valid until the end of the year. Renewal opens one month before it expires." and "Monthly bank slip, with the payment history in the statement." Item: title "Advanced settings"; tag "New"; status "Done". Documentation examples: "Add products", "2 fields left", "Pending", "PRO". Matrix group labels: "Contract and billing", "Documents". The Figma texts are in Portuguese; the prose carries them in English.

## Accessibility (as in Figma)

- **Contrast:** title in `color/foreground` (`collapsible/title-foreground`): 21:1 light and 12.45:1 dark on `accordion/background`; 18.08:1 and 7.68:1 on the hover (`collapsible/trigger-background-hover`, on `color/accent`). Description, indicator and start icon in `color/muted-foreground` (`collapsible/description-foreground`, `collapsible/indicator-foreground`, `collapsible/icon-foreground`): 6.69:1 and 8.28:1 on `accordion/background`; 5.76:1 and 5.11:1 on the hover. Tile icon in `accordion/tile-foreground` on `accordion/tile-background`: 4.78:1 light and 13.79:1 dark. Status icons (`accordion/status-success-icon`, `-warning-icon`, `-error-icon`, `-pending-icon`): 3.49:1 to 8.28:1 on `accordion/background` and on the hover, above the 3:1 of an icon. Tag and status follow the `nph-badge` colors. The soft outline (`accordion/border`) is decorative: the trigger is recognized by its text and its indicator. In dark the tile is 1.09:1 against the card: the box is decorative and the icon carries the sign.
- **Visible focus:** with the keyboard, the trigger shows the border `collapsible/focus-border` (on `focus/border`): 5.37:1 light and 9.88:1 dark on `accordion/background`; 4.63:1 and 6.10:1 on the hover. The halo `collapsible/focus-halo` (on `focus/halo`), outside the border, is support: the border meets the 3:1. The focus is on the trigger, not on the container; with focus, the halo covers the neighbor divider by 1 px, and the border stays whole. These values are read in Figma, where `focus/border` light resolves to tone 600 of `Sistemas` (`#2F68C5`). The code resolves it to `theme/brand-focus`, tone 500 (`#3B82F6`, as `design.md` records): 3.68:1 on `accordion/background` and 3.17:1 on the hover in light, computed from the code values. The `focus/border` rule of `design.md` measures the 3:1 against the halo, the neighbor outside the border: 2.92:1 in `Sistemas` light, the known limit written there (4.26:1 with the Figma value); in dark every brand meets it. The focus tokens are the ones of the `nph-collapsible` (`collapsible/focus-*`), so the accordion has the same values.
- **Color is not the only sign:** open and closed differ by the direction of the indicator and by the content in view; the open item does not change its background. Status and pending items come in text, in the end status or in the item description; the start status icon only reinforces the text.
- **Touch target:** the trigger takes the width of the item. The minimum height comes from the size: `collapsible/trigger-height-compact` (28), `collapsible/trigger-height` (36) and `collapsible/trigger-height-large` (44), all above the 24 px of WCAG 2.5.8; with a description or start media the trigger grows. On a touch screen, use the large size.
- **Accessible name:** each trigger is a button with `aria-expanded` and `aria-controls`, inside a heading whose level comes from the page. The name read is the title, then the tag text and the status (for example "Add products, New, Done"). The short description, of a few words, goes inside the button, and the reading follows the order of the parts: title, tag, description and status (for example "Add products, New, 2 fields left, Pending"); the long description goes to the content (item 11). The indicator is decorative (`aria-hidden`); the start media (icon, tile, avatar, image and status icon) too, with empty alternative text on the image and on the avatar. The status icon is decorative only with the end status tag; without the tag it carries a hidden text. Nothing interactive goes in the trigger: the button is the only child of the heading.
- **Keyboard and motion:** Tab and Shift+Tab go through the triggers; Enter and Space open and close the focused item, and the focus stays on the trigger. Closed content leaves the Tab order. It opens and closes in `collapsible/expand-duration` with `collapsible/expand-easing` (on `motion/expand-*`); with reduced motion it opens with no animation.
- **Disabled:** the whole item at `collapsible/disabled-opacity` and it does not open. Open and disabled is only for a whole locked section: the content stays in view under the same opacity, and the button leaves the Tab order. It is not the APG case of a panel that cannot close: there the item uses the plain open look, with no opacity, and only the trigger takes `aria-disabled="true"`, staying in the Tab order. When the lock does not explain itself, a text of the page, outside the accordion and near the group, says why the section is locked.

## Properties, variants and states (as in Figma)

- **Appearance:** grouped (default): one container with background `accordion/background`, the soft outline (`accordion/border`) and the `elevation/raised` shadow, with the divider between items; for the page body. Separated: each item in a block of its own, `accordion/item-gap` (16) from the next one, with no shadow and no divider; for independent sections. Flush: no container and no background, with the divider between items; for a side panel or inside another container.
- **Expansion:** multiple (default): each item opens and closes alone, and several sections stay open at once, to compare. Single: opening an item closes the open one; the open one can also close, and all closed is allowed.
- **Size:** default (default), compact and large change the minimum trigger height of every item, `collapsible/trigger-height` (36), `collapsible/trigger-height-compact` (28) and `collapsible/trigger-height-large` (44), and the size of the tile, the avatar and the image at the start: 32, 24 and 40 (image 48 in large). In large the title uses `text/label-lg`.
- **Item:** each item is an exposed instance of the accordion item. In the item: title; description and description text; start, with the type (icon, tile, avatar, image, status success, status warning, status error or status pending), whose size follows the item; tag; end, with the status; size (compact, default or large), which follows the accordion size and does not change item by item; indicator (end or start); open (no or yes); state (default, hover, focus or disabled).
- **Width:** the example width is 560 (`layout/max-reading`). In use the instance stretches to the width of the container.
- **Outside the properties:** the content of each item is a free slot, filled in use. The piece carries sample items: hide the extra ones. A long title wraps in use; in the piece the title hugs the text. The heading level and the rule that closes the open item in the single expansion stay with the code.

## Relations and context (as in Figma)

The icons are `nph-icon`, the start media is `nph-avatar` or `nph-image`, the tag and the status are `nph-badge` and the divider is an `nph-separator`. The accordion controls the container, the divider, the space between items and the opening rule (expansion). The item controls the trigger, the texts, the media, the tag, the status, the indicator, the hover, the focus, the disabled state and the motion. Any piece goes inside the content, with its own color and focus rules. Actions on the content, such as save, stay inside it, with `nph-button`, never in the trigger. Inside a card or a side panel, use the flush appearance, so two outlines do not add up.

| Between | Space |
|---|---|
| container edge → items (grouped) | `accordion/padding` (16), on the four sides |
| item → divider → item (grouped and flush) | `accordion/divider-spacing` (4) above and below the divider |
| block → block (separated) | `accordion/item-gap` (16), no divider |
| block edge → trigger and content (separated) | `accordion/padding` (16) |
| start → title (in the trigger) | `accordion/media-gap` (8) with tile, avatar and image; `collapsible/trigger-gap` (4) with icon and status icon |
| title → tag | `accordion/tag-gap` (8), on the title line |
| title → description | `accordion/title-gap` (2) |
| title → status → indicator | indicator at the end: `collapsible/trigger-gap` (4) before the status (the right padding of the text block) and `accordion/end-gap` (8) after it; with no status, the 4 is the space to the indicator. Indicator at the start: `collapsible/trigger-gap` (4) before the status (the left padding of the end) and nothing after it |
| trigger → content (in the item) | `collapsible/content-padding-top` (8), no divider; the content follows the side padding of the trigger |

Partial radius (`regras_raio_parcial` in `design.md`): nothing inside the grouped container touches its edge (16 px padding); the hover pill keeps `collapsible/trigger-radius`, inset.

## When to use (as in Figma)

- The grouped appearance (default) in the page body, for the details of a record or frequently asked questions.
- The separated appearance when each section is an independent block, such as the steps of a setup; with the single expansion when one step leads to the next.
- The flush appearance in a side panel or inside another container (card, dialog), so two outlines do not add up.
- The multiple expansion when the person compares sections; the single one in a step-by-step.
- The size of the other controls of the screen: large on a touch screen; compact in a dense panel, with a pointer.
- The start to recognize the section at a glance: icon or tile for a topic, avatar for a person, image for a product. The tag for a short highlight ("PRO", "New") and the end status for the progress ("Done", "Pending").
- For a single section, the `nph-collapsible`; for sections of the same weight seen one at a time, the `nph-tabs`. Do not put an accordion inside another: use sections with a title on the page.

## Required examples (in Figma, light and dark)

1. The details of a contract: grouped, several sections open, a status icon at the start and the status in text in the description.
2. The steps of a setup: separated, one section open at a time, the pending item in text in the description.
3. Filters in a side panel, with a pointer: flush, compact, several sections open.

## Do (as in Figma)

- Write short titles, different from each other, because the person finds the section without opening all of them.
- Keep the whole trigger clickable, because the larger target is easier to hit with the mouse and with the finger.
- Use the multiple expansion when the person compares sections, because both stay open at the same time.
- Show status and pending items in text, in the end status or in the item description, because color alone does not reach everyone and the closed item does not hide the warning.
- Use the large size on a touch screen, because 44 px of height give a comfortable target for the finger.
- Separate the items by the soft outline and by space, because a strong outline everywhere makes the screen heavy.
- Use one start type in the same list (the status icons, from success to pending, count as one type), because the icon (16) and the tile, avatar or image (24 to 48) misalign the titles.

## Do not (as in Figma)

- Do not repeat the same title in several sections. Instead: give each section a name that says its content.
- Do not hide an error, a warning or a pending required field in a closed item. Instead: show the pending item in text: in the description ("2 fields left") or in the end status ("Pending"), or keep the field in view on the page.
- Do not put a strong outline on each item. Instead: use the grouped appearance, with a soft outline on one container, or the separated one, with a soft outline and space between the blocks.
- Do not use the compact size on a touch screen. Instead: use the large size, 44 px high.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG Accordion pattern, revised in 2026 (no arrows, Home or End). Three rows go beyond the APG, as additions decided on the approval page (items 9 and 11): direct link and page search, decorative start media, and open and disabled.

| Row | Rule | Source |
|---|---|---|
| Tab and Shift+Tab | Go through each trigger, in page order, and through the focusable elements of the open content. | APG, https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ |
| Enter and Space | On a closed trigger they open; on an open one they close. In the single expansion, opening one closes the other. | APG |
| Arrows, Home and End | No effect: the APG removed these keys from the accordion. | APG revision of 2026, https://github.com/w3c/aria-practices/pull/3434; Radix and Mantine still move the focus with the arrows; Fluent marked them obsolete |
| Focus on open and on close | Stays on the trigger; it does not jump to the content. | APG |
| Esc | No effect. | APG (the pattern does not list Esc) |
| Outside click | No effect: nothing closes. The accordion is not a layer. | APG |
| Pointer and focus | Hover only paints the trigger; it does not move the focus. The focus border and halo show with the keyboard (`:focus-visible`), not on a click. | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible |
| Near the window edge | Does not apply: the accordion does not float; the open content pushes the page down. | APG |
| Single expansion | Opening an item closes the other; the open one can close, and all closed is allowed. An open item that cannot close follows the row "Open that does not close". The special cases (two or more marked open, an item that does not close, a locked section) are an open point of the task ("Single expansion and the special items"). | APG; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details; Mantine; Radix differs (it does not let the open one close by default) |
| Multiple expansion (default) | Each item opens and closes alone; several stay open at once. | Partly in the APG; https://www.nngroup.com/articles/accordions-on-desktop/ ; Mantine, Spectrum and USWDS open one at a time by default |
| Heading level | Each trigger is the only child of a heading; the level comes from the page (`h3` when nothing is said, changeable). | APG; GOV.UK uses `h2` by default |
| Region | The content takes `role="region"` with `aria-labelledby` on the trigger; no region when more than about six panels can be open at once. | APG; Radix always sets region |
| Disabled item (closed) | Closed and disabled: leaves the Tab order (`disabled` on the button), with the item opacity. A focusable `aria-disabled` only if the screen reader needs to find the item. | APG keyboard practice, https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ |
| Open that does not close | The APG case of a panel that cannot close: the trigger takes `aria-disabled="true"` and stays in the Tab order; the item uses the plain open look, with no opacity. It is not the open and disabled variant. | APG |
| Open and disabled | Only for a whole locked section, with `disabled` on the button (out of the Tab order, as the closed disabled one) and the content in view under `collapsible/disabled-opacity` (T11, rule 1); content that must be read uses the previous row (item 11). | Addition, outside the APG; APG keyboard practice |
| Closed content | Out of the Tab order and of the accessibility tree (`hidden`). | APG; https://designsystem.digital.gov/components/accordion/ |
| Direct link and page search | Closed content in `hidden="until-found"`; a `#id` link or the browser search opens the item, and the `beforematch` event sets `aria-expanded`; with no support, the item of the `#id` opens on load (item 9). Support read on 2026-11-16, to check again in the compatibility table before the code: Chrome and Edge 102, Firefox 148, Safari 26.2 partly. | Addition, outside the APG; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden ; https://developer.chrome.com/docs/css-ui/hidden-until-found ; GOV.UK already opens the item from the page search |
| Reduced motion | With `prefers-reduced-motion: reduce`, it opens and closes with no height animation (`collapsible/expand-duration` and `collapsible/expand-easing` of the `nph-collapsible`, on `motion/expand-*`). | WCAG 2.3.3, https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html |
| Start media | Icon, tile, avatar, image and status icon at the start are decorative: `aria-hidden` on the icon and empty alternative text (`alt=""`) on the image and on the avatar; the section name comes from the title. The status icon is decorative only with the end status tag; without it, it carries a hidden text (item 11). | Addition, outside the APG; https://www.w3.org/WAI/tutorials/images/decorative/ |
| Tag and status in the accessible name | Tag and status are non-interactive text inside the trigger button and enter the accessible name after the title; the button takes no `aria-label`, which would hide that text. | Partly in the APG (names and descriptions), https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/ |
| Nothing interactive in the trigger | The button is the only child of the heading: no link, button, menu or checkbox in the trigger; the action goes inside the content. | APG; https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element |
| Description in the button name | A short description, of a few words, inside the button, read in the order of the parts: title, tag, description, status, as in GOV.UK; the long one goes to the panel (item 11). | https://design-system.service.gov.uk/components/accordion/ ; APG names and descriptions |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Combined states (T11)

Single Nephos rule (decision register, T11): selected or checked + disabled keeps the background and the mark, under the disabled opacity; error + disabled: disabled wins and only the opacity stays. In the accordion, open + disabled follows rule 1 by analogy: the open item keeps the content in view and the indicator turned, under `collapsible/disabled-opacity` (item `7227:26332`, state=disabled, open=yes). By item 11 it is only for a whole locked section; the APG case of a panel that cannot close does not use this variant (plain open look, `aria-disabled` on the trigger). End status + disabled: the status icon and the status tag stay in view, under the same opacity as the rest of the item. Error + disabled does not apply: the accordion has no error state; the "error" status is text, not a state.

## Order and alignment of the parts (appendix)

- Grouped and flush: items and dividers from top to bottom, vertical, aligned to the start and to the top; items and dividers fill the container width.
- Separated: blocks from top to bottom, gap 16; each block vertical, aligned to the start and to the top, with the item at its width.
- Outline: in Figma, layers in absolute position, pinned to the container or block edge, with the stroke inside.
- Trigger: horizontal, from start to end: start, text, end (status) and indicator, all centered on the vertical axis. Text: vertical, aligned to the start and to the top. Title line: horizontal, title and tag centered. With the indicator at the start, the order is indicator, start, text and end; the end gains 4 px of left padding.
- Content: below the trigger, the body vertical, aligned to the start and to the top; side padding equal to the trigger (`collapsible/content-padding-x`), with no indent for the start media. With the indicator at the start, a 20 px spacer (16 + 4) aligns the content to the part after the indicator: the title, or the start when there is one.
- Start piece: the icon or the media centered, with its right padding on the piece itself: 4 px (`collapsible/trigger-gap`) on the icon and the status icon, 8 px (`accordion/media-gap`) on the tile, the avatar and the image.

## Icon and image

| Piece | Weight | Size and color | When it changes |
|---|---|---|---|
| Indicator at the end (`nph-icon` `chevron-down`) | light, fixed | 16 (`collapsible/indicator-size`); `collapsible/indicator-foreground` | Turns 180 degrees when the item opens. It never swaps weight in hover or open. |
| Indicator at the start (`nph-icon` `chevron-right`) | light, fixed | 16; `collapsible/indicator-foreground` | Turns 90 degrees to point down when the item opens. |
| Start icon (`nph-icon`, `gear` in the piece) | light | 16 in the three sizes (`collapsible/icon-size`); `collapsible/icon-foreground` | Swapped through the exposed icon of the start piece, only for a light Font Awesome `nph-icon`. |
| Start image (`nph-image` 1:1) | does not apply | `image/size-xs` 24, `image/size-sm` 32 and `image/size-md` 48 (compact, default, large); corner `image/radius-sm` and `image/radius-md`; outline `image/border` | Square crop (1:1), filling the box. Exported at 2x (48, 64 and 96 px), 1:1 crop (item 11). |
| Start tile (`nph-icon` on a tonal box, `folder` in the piece) | light | icon `accordion/tile-icon-size` (16) in compact and default and `accordion/tile-icon-size-large` (24) in large, in `accordion/tile-foreground`; box `accordion/tile-background`; corner `accordion/tile-radius` (8) on the four corners; padding 4, 8 and 8 | Swapped through the exposed icon of the tile, only for a light `nph-icon`. |
| Start avatar (`nph-avatar`) | does not apply | `avatar/size-sm` 24, `avatar/size-md` 32 and `avatar/size-lg` 40, with `avatar/radius-sm`, `-md` and `-lg`; with no photo, the person in `icon/size-md` | With or without a photo. |
| Start status icon (`nph-icon`) | light | 16 in the three sizes; `accordion/status-success-icon`, `-warning-icon`, `-error-icon`, `-pending-icon` | One icon per status, fixed in each variant: `circle-check` (success), `triangle-exclamation` (warning), `circle-xmark` (error), `clock` (pending). |
| Tag and end status (`nph-badge` light) | does not apply | 24 high, `nph-badge` colors | The brand tag uses primary light; the status uses the tone of the status (success, warning, error; secondary for pending), always with text. |

## Limits (the "Limites" row of the Figma matrix)

- Minimum: one item.
- Maximum: no ceiling in the piece, it takes the container; 560 (`layout/max-reading`) is the example and reading width, and wider the text loses its measure.
- Long text: title and description wrap into lines (samples in Portuguese about contracts, amendments and invoices, and about the documents sent).
- Long text with start, tag and status: the title wraps (in Figma by an override of the fill width; in code it wraps by itself); a title of 40 px and a trigger of 90 px high in the sample (the sample title lists the contract data, term, automatic renewal and the signatories; the description says renewal opens one month before it expires and needs both parties' signatures).
- Empty: does not apply. An accordion with no items does not show; with no content, the section leaves the page.
- Many items: split into groups with a label, instead of a long list.
- Short window: does not apply. The panel opens in the page flow, pushes the content and the page scrolls; there is no floating layer.

## What the accordion asks of other pieces

Read on `v/5.0.0` (`fichas/nph-collapsible.md`, `src/components/nph-collapsible/nph-collapsible.ts`, `fichas/nph-separator.md`, `src/components/nph-separator/nph-separator.css`):

| It asks | Does the piece do it today? |
|---|---|
| `nph-collapsible`: closed content in `hidden="until-found"`, plain `hidden` when disabled, `beforematch` opens it | Yes: the collapsible does exactly this (`nph-collapsible.ts`, `hidden` until-found, `@beforematch`). |
| `nph-collapsible`: the description inside the button name (item 11) | No: the collapsible puts the description as the accessible description (`aria-describedby`), not part of the name. The accordion item differs here by decision. |
| `nph-collapsible`: the trigger inside a heading whose level comes from the page | No: the collapsible has no heading. |
| `nph-collapsible`: start tile, avatar, image or status icon; tag next to the title; status at the end | No: the collapsible has only the start icon and "has no image" (DSA-78). They come to it in the adjustment of item 7; until then, the accordion item draws them. |
| `nph-collapsible`: an open item that cannot close (`aria-disabled="true"`, still in the Tab order) | No: the collapsible has open and disabled only. |
| `nph-collapsible`: title to description gap of 2 | No: `collapsible/title-gap` is 8 until the adjustment of item 8; the accordion uses `accordion/title-gap`. |
| `nph-separator`: line color `accordion/divider` | No: `fichas/nph-separator.md` fixes the separator color at `color/border` and its CSS has no color hook (`background-color: var(--nph-color-border)`). Open point for the code (task). The value is the same as `card/divider`, also `color/border-subtle`. |
| `nph-badge` primary light (tag) and light of status, `nph-avatar` sm/md/lg with or without photo, `nph-image` xs/sm/md 1:1, `nph-icon` light | Yes: existing variants (DSA-12, DSA-24, DSA-51, DSA-03). |

## Inherited decisions

- DSA-78 (decision refs): the accordion item was to be an instance of the `nph-collapsible`; today it is the accordion's own item, with the `collapsible/*` bound straight, until the adjustment of item 7.
- Follows DSA-78 partly (Specification, Keyboard): Tab reaches the trigger; Enter and Space open and close; the focus stays on the trigger. Arrows, Home, End and Esc with no effect come from the APG revision (PR 3434), not from DSA-78, which says that a group with an opening rule is the accordion.
- Follows DSA-78 (Specification, Hover and open): hover paints the trigger in `collapsible/trigger-background-hover`; open does not change the background.
- Follows DSA-78 (Specification, Focus): focus border and halo on the trigger, not on the container.
- Follows DSA-78 partly (Specification, Content spacing): the content starts 8 below the trigger (`collapsible/content-padding-top`). Declared deviation: the content does not indent for the start media (it keeps the indent for the start indicator).
- Follows DSA-78 partly (Specification, Limits, "the trigger shows the pending item in the description, in text"): errors, warnings and a pending required field are not hidden in closed content; the status also gains the tag with text at the end; color never goes alone.
- Follows DSA-78 partly (decision refs, card outline in `color/border` at `border/width`): the accordion uses the collapsible look in flush; the grouped and separated outline is the accordion's, in `color/border-subtle` (item 5).
- DSA-78 D-1 and D-2 (preview type) do not apply: the accordion uses only the line type. D-3 (animate the height) applies to the item.
- Declared deviation from DSA-78 ("optional start icon … swappable for another light nph-icon"; "The component has no image"): the accordion item carries icon, tile, avatar, image, tag and status; it returns to the inheritance with the adjustment of item 7.
- Follows DSA-30 D5: reading width of 560 (`layout/max-reading`) in the examples.
- DSA-76 (panel menu mode of the nph-sidebar): another family (navigation), not inherited.
- Follows DSA-88 decision 8: the tile corner is `radius/inset` (8), the start icon box of the nph-card; the 24 and 32 thumbnail keeps `radius/inner`. Also from DSA-88 as support: decision 4 (tile in dark), 9 (a component token straight to the core with one consumer, `card/icon-container-padding`), 10 (media size by size) and 13 (the collapsible card appearance changes in its next adjustment). DSA-88 is `done`.
- Register: T9 (token layers), T11 (combined states).

## Decisions answered (approval page of 2026-11-19, items 1 to 9 and 11, all as recommended)

| Item | Decision |
|---|---|
| 1 | Documentation `7428:43770` accepted; the description of the set `7227:26169` holds its summary. |
| 2 | `accordion/title-gap` → `core/space/50` (2), by decision, with a declared deviation from rule 2 of T9 and from the spacing foundation (half-step only in chip, icon and table cell); `space/stack-tight` (4), `space/stack-snug` (8) and `radius/subtle` (2) refused. The description of `core/space/50` names the accordion. Sources: https://carbondesignsystem.com/elements/spacing/overview/ , https://atlassian.design/foundations/spacing |
| 3 | `accordion/tile-padding` → `core/space/200` and `accordion/tile-padding-compact` → `core/space/100`, by decision (rule 3 of T9), until a semantic of inner padding of a small piece exists (a foundation task). Sources: https://atlassian.design/foundations/spacing , https://raw.githubusercontent.com/primer/primitives/main/src/tokens/functional/size/size.json5 |
| 4 | `accordion/divider-spacing` → `space/inline-tight` (4), with a declared deviation, by the vertical use between list rows the Nephos already makes. The research of 2026-11-19 preferred `core/space/100` straight; the recommendation rests on the internal precedent. Sources: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/accordion/_accordion.scss , https://raw.githubusercontent.com/mantinedev/mantine/master/packages/@mantine/core/src/components/Accordion/Accordion.module.css |
| 5 | `accordion/border` and `accordion/divider` → `color/border-subtle`; the description of `color/border-subtle` gains "outline and divider of the nph-accordion", and `color/border` gains the nph-accordion in its DO NOT USE, removing no use. Source: the Carbon accordion style above. |
| 6 | `accordion/tile-background` → `color/primary-surface`, `accordion/status-pending-icon` → `color/muted-foreground`, `accordion/tile-icon-size-large` → `icon/size-lg`, with the accordion written into the description of each semantic and an exception to the "DO NOT USE in a list" of `icon/size-lg`, only for the large tile. The pending status needs a shape or a symbol beyond color (the `clock` icon and the tag). Sources: https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-comp-list.scss , https://carbondesignsystem.com/patterns/status-indicator-pattern/ , https://atlassian.design/components/icon/icon-tile/examples |
| 7 | The start media, the tag and the end status move to the `nph-collapsible`, hidden by default, in an adjustment of its own with a task for the code owner; until then the accordion uses its own item. It changes the `nph-collapsible` scope later, not in this task. Sources: https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/accordion/src/accordion.tsx , https://react-aria.adobe.com/DisclosureGroup |
| 8 | In that adjustment `collapsible/title-gap` goes from 8 to 2, with a task for the code owner; nothing changes now. |
| 9 | Closed content in `hidden="until-found"`; with no support, the item of the `#id` opens on load. Check the browser support before the code. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden , https://design-system.service.gov.uk/components/accordion/ |
| 11 | (a) The short description inside the button, read title, tag, description, status; the long one in the panel. (b) The start image exported at 2x (48, 64 and 96 px), 1:1 crop. (c) The start media decorative; the status icon decorative only with the status tag, otherwise with a hidden text. (d) The open and disabled variant only for a whole locked section; content that must be read uses the APG case, open with no opacity. Note of the research: consider `aria-disabled` also on the locked section, so a screen reader user knows it exists. Sources: https://design-system.service.gov.uk/components/accordion/ , https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ |

Item 10 (a line of the design owner's taste notes) had no answer; it changes nothing in the piece or in the code.

**Points that followed the recommendation.** Points of the appendix that were not approval items follow the recommendation, approved with the approval page of 2026-11-19, because the recommended option was already in the root the design owner accepted: no tint on the open item, hover in `color/accent` through `collapsible/trigger-background-hover`; separated block in `color/card` with the soft outline and `radius/surface`; container and block padding of 16; appearances grouped (default), separated and flush; start media of 24, 32 and 40 (image 48 in large); brand tag `nph-badge` primary light; status as a start icon plus a tag with text at the end; 8 item states per size, with no pressed state; content with no indent for the start media; title line of 24 with the tag; status in view under the opacity of a disabled item; the accordion enters v1 by the rule of the finished component. Kept from earlier rounds: multiple as default, single as variant; keyboard only Tab, Shift+Tab, Enter and Space; no action in the header; 28 in compact passes the 24 of WCAG 2.5.8.

## Hidden on purpose in Figma

- The `borda (escuro)` outline in light and `borda` in dark (`scheme/*`).
- In the item: start, description, tag and end when their boolean is off (all off by default).
- In the matrix limits: "empty" and "short window" only with a caption (do not apply); the seventh case of the limits is the loose item `7228:48599`, outside the set.
- In the item variants where the start layer is hidden in the master (`7227:26335`, `7227:26615`, `7227:26629`, `7227:26775`), the instance shows the start through the property.
- In the documentation, the wrong example `I7428:44320` of "Do not" uses `color/border` on purpose.
- Known limit of the Figma API: the width and height of the tile icon inside nested instances (root and documentation, 16 nodes) stay on `icon/size-sm`, the same value (16) as `accordion/tile-icon-size`; the master is on `accordion/tile-icon-size`.
