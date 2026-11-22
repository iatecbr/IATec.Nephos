```json
{
  "task": "DSA-99",
  "gate": "figma-docs-accepted",
  "date": "2026-11-19",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=7389-104",
    "date": "2026-11-19",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-popconfirm (green page 4128:35277, root 7222:3379), and its documentation frame (7389:104) was accepted, with COMPONENT_SET nph-popconfirm (7222:3568). On the approval page of 2026-11-19 the design owner approved items 1 to 10, all as recommended: (1) documentation 7389:104 accepted; (2) fixed width, 304 and 372 px, on two new core widths core/layout-width/popconfirm-sm and -md; (3) the destructive icon on color/destructive-on-surface; (4) the icon box backgrounds status/info-surface, status/warning-surface and color/destructive-surface, with their descriptions widened; (5) the icon box radius on radius/inset, with its description widened; (6) the md padding and the icon box padding straight to the core by decision; (7) scope by reversibility; (8) alertdialog with no aria-modal and the Tab kept between the two buttons; (9) a press outside leaves the focus where the person pressed; (10) the nph-button focus fix in a task of its own."
  }
}
```

# DSA-99 — `figma-docs-accepted`

The documentation of the nph-popconfirm (frame `7389:104`, page `4128:35277`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `7222:3379`. The nph-popconfirm is a short confirmation anchored to a trigger, opened by click, Enter or Space. It asks a question about the action the person just requested and offers two ways out: Cancel and the verb of the result. It varies by type, side, alignment, arrow and size; the icon and the description turn on and off. The actions sit in a band of their own, separated from the text by a soft divider.

Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New group `popconfirm/*`, 32 tokens. 22 alias semantics (rule 2 of T9); 2 alias the two new core widths; 8 point straight to the core by decision (rule 3 of T9).
- Two new core values (rule 4 of T9, item 2): `core/layout-width/popconfirm-sm` (304) and `core/layout-width/popconfirm-md` (372), consumed only by `popconfirm/width-sm` and `popconfirm/width-md`. No variable was worth 304 or 372; the `core/layout-width/popover-*` primitives say "do not consume directly: use popover/width-*".
- Straight to the core by decision. Every semantic of the same value was read in code and refused:
  - `popconfirm/radius` → `core/radius/600` (14), as `popover/radius` and `hover-card/radius`: `radius/surface`, the only radius of 14, says DO NOT USE on a floating layer; the other 14 are text sizes (`text/*`).
  - `popconfirm/offset` → `core/space/100` (4), as `popover/offset`: `space/inline-tight` and `space/stack-tight` are the gap inside a unit, `radius/inner` is a radius and `focus/ring-width` the focus ring; none names the distance from the trigger.
  - `popconfirm/arrow-width` and `popconfirm/arrow-inset` → `core/space/400` (16), as `popover/arrow-width` and `popover/arrow-inset`: `space/stack` is stacked items, `space/container-padding` the padding of a panel, `layout/margin-compact` a page margin, `icon/size-sm` an icon; the other 16 are `text/*`.
  - `popconfirm/arrow-height` → `core/space/200` (8), as `popover/arrow-height`: `space/inline` and `space/stack-snug` are gaps between pieces; `radius/container`, `radius/inset` and `focus/radius-inner` are radii.
  - `popconfirm/padding-md` and `popconfirm/footer-padding-md` → `core/space/600` (24), item 6: no semantic is the padding of a floating layer that does not block the page; `space/surface-padding` is the card, `space/overlay-padding` the layer that blocks the page, `layout/gutter` and `layout/margin-default` the page, `icon/size-lg` an icon; the other 24 are `text/*`.
  - `popconfirm/icon-box-padding` → `core/space/200` (8), item 6, as `card/icon-container-padding` (DSA-88 decision 9): the same semantics of 8 refused above.
- Descriptions changed in `design.md`, with no value change: `status/info-surface`, `status/warning-surface` and `color/destructive-surface` take the icon box of the popconfirm (item 4); `radius/inset` becomes "fitted inside a card or a floating layer" (item 5), and the radius tables follow; `color/destructive-on-surface` takes the destructive icon (item 3). The `use` of every semantic below that did not cite the popconfirm now does (Fluxo step 15, item 7).

## Purpose

Short confirmation anchored to a trigger, so the person confirms or gives up, without leaving the place, an action of low to medium risk: one that can be undone, even with effort, or that loses little (for example, it goes to the trash). Selection: type, side, alignment, arrow and size. The icon and the description turn on and off by property; the title and the two actions are always visible.

Description of the set (Figma Description field of `7222:3568`, accepted): a short confirmation anchored to a trigger, to confirm or give up, without leaving the place, an action of low to medium risk: one that can be undone, even with effort, or that loses little. Choose the type by the consequence: default for a step that changes the state, warning when a small piece of work may be lost, destructive when something goes away. Do: the title as a question about the action; Confirm with the verb of the result; no arrow by default; the focus back to the trigger on close or, if it is gone, to the next logical element (on a press outside, where the person pressed). Do not: Yes and No on the buttons; the default type to delete; a light action that is undone right away (use Undo in the nph-notification); a serious, irreversible action or one with a long explanation (use the nph-dialog, with a danger button for the serious or irreversible action).

## Component set

- `nph-popconfirm` `7222:3568`, 42 variants. Properties: type [`padrao` (default) | `aviso` (warning) | `destrutivo` (destructive)], side [`bottom` | `top` | `right` | `left`], alignment [`center` | `start` | `end`], arrow [`sem` (off) | `com` (on)], size [`sm` | `md`]; booleans `ícone` (icon) and `descrição` (description), both on by default; text properties `texto do título` (title text) and `texto da descrição` (description text). Default variant: default type, bottom, center, no arrow, sm.
- Combinations: with no arrow, type × size = 6 (bottom, center); with the arrow, type × side × alignment, sm only = 36. With no arrow the code resolves the position.
- Measured variants: no arrow sm 304 × 215; no arrow md 372 × 251; with the arrow on bottom and top 304 × 222; on right and left 381 × 175 (surface of 304 plus arrow and trigger beside it).

## Tokens

Light and dark values; none follows the brand.

### `popconfirm/*`

| Token | Alias | Light · dark | Where the piece uses it |
|---|---|---|---|
| `popconfirm/background` | `color/popover` | #FFFFFF · #2D333B | Background of the surface and fill of the arrow. |
| `popconfirm/title-foreground` | `color/popover-foreground` | #0C0C0C · #E3E3E3 | Title. |
| `popconfirm/description-foreground` | `color/muted-foreground` | #5C5C5C · #B7BBC1 | Description. |
| `popconfirm/border` | `color/border-subtle` | #F1F1F1 · white 10% | Outline of the surface and of the arrow. |
| `popconfirm/divider` | `color/border-subtle` | #F1F1F1 · white 10% | Color of the divider line between the content and the footer. |
| `popconfirm/border-width` | `border/width` | 1 · 1 | Thickness of the surface outline and of the arrow outline. |
| `popconfirm/radius` | `core/radius/600`, by decision | 14 · 14 | Corner of the surface, four corners. |
| `popconfirm/padding-sm` | `space/container-padding` | 16 · 16 | Padding of the content, four sides, sm. |
| `popconfirm/padding-md` | `core/space/600`, by decision | 24 · 24 | Padding of the content, four sides, md (item 6). |
| `popconfirm/footer-padding-sm` | `space/container-padding` | 16 · 16 | Padding of the actions band, four sides, sm. |
| `popconfirm/footer-padding-md` | `core/space/600`, by decision | 24 · 24 | Padding of the actions band, four sides, md (item 6). |
| `popconfirm/text-gap` | `space/stack-snug` | 8 · 8 | Vertical gap between the title and the description. |
| `popconfirm/icon-gap` | `space/inline` | 8 · 8 | Horizontal gap between the icon box and the text block. |
| `popconfirm/actions-gap` | `space/inline-loose` | 12 · 12 | Horizontal gap between Cancel and Confirm. |
| `popconfirm/icon-size-sm` | `icon/size-sm` | 16 · 16 | Type icon, sm. |
| `popconfirm/icon-size-md` | `icon/size-lg` | 24 · 24 | Type icon, md. |
| `popconfirm/icon-box-padding` | `core/space/200`, by decision | 8 · 8 | Padding of the icon box, four sides (item 6). |
| `popconfirm/icon-box-radius` | `radius/inset` | 8 · 8 | Corner of the icon box (item 5). |
| `popconfirm/icon-box-background` | `status/info-surface` | #E6F3F9 · #001A28 | Icon box, default type (item 4). |
| `popconfirm/icon-box-background-warning` | `status/warning-surface` | #FDEEE7 · #2F1202 | Icon box, warning type (item 4). |
| `popconfirm/icon-box-background-destructive` | `color/destructive-surface` | #FCE9E9 · #2C0808 | Icon box, destructive type (item 4). |
| `popconfirm/icon-foreground` | `status/info` | #026A9F · #359DD2 | Icon, default type (`circle-question`). |
| `popconfirm/icon-foreground-warning` | `status/warning` | #BB460A · #EE793D | Icon, warning type (`triangle-exclamation`). |
| `popconfirm/icon-foreground-destructive` | `color/destructive-on-surface` | #B01E1E · #F8D4D4 | Icon, destructive type (`triangle-exclamation`), on its box (item 3). |
| `popconfirm/width-sm` | `core/layout-width/popconfirm-sm` | 304 · 304 | Fixed width of the surface, sm (item 2). |
| `popconfirm/width-md` | `core/layout-width/popconfirm-md` | 372 · 372 | Fixed width of the surface, md (item 2). |
| `popconfirm/offset` | `core/space/100`, by decision | 4 · 4 | Distance from the trigger to the surface (no arrow) or to the tip of the arrow. |
| `popconfirm/arrow-width` | `core/space/400`, by decision | 16 · 16 | Base of the arrow. |
| `popconfirm/arrow-height` | `core/space/200`, by decision | 8 · 8 | Height of the arrow; also the depth of the arrow track. |
| `popconfirm/arrow-inset` | `core/space/400`, by decision | 16 · 16 | Distance of the arrow from the corner, in start and end. |
| `popconfirm/enter-duration` | `motion/enter-duration` | 250 ms | Entrance. Code only: Figma does not animate. |
| `popconfirm/exit-duration` | `motion/exit-duration` | 150 ms | Exit. Code only. |

The icon box is 32 px in sm (16 of icon plus 8 + 8) and 40 px in md (24 plus 8 + 8).

### Used directly or by instance, with no `popconfirm/*` token

- **Trigger, Cancel and Confirm:** `nph-button` instances with their own tokens: the trigger and Cancel secondary solid (`button/secondary-solid-background`, `-hover` on the open trigger), Confirm primary solid (`color/primary`) in default and warning and danger solid (`color/destructive`) in destructive; `radius/control`, `control/height-default` (36), `space/control-padding`, `space/inline-tight`; focus `focus/border`, `focus/halo`, `focus/halo-danger`, `focus/ring-width`.
- **Icon glyph:** the `nph-icon` instance (`circle-question` and `triangle-exclamation`, solid); the popconfirm overrides its size and color with the tokens above.
- **Divider:** in Figma, an `nph-separator` horizontal; the thickness and the height stay in `border/width` (1), from the separator; only the line color is the popconfirm's (`popconfirm/divider`), by an override. See "What the popconfirm asks of other pieces".
- **Shadow:** the effect style `elevation/dropdown` straight (`shadow/color`, black at most 10% in light and 0% in dark). In dark the surface stands apart by the lighter background.
- **Text styles:** `text/heading-sm` (16, SemiBold) for the title in sm, `text/heading-md` (20, SemiBold) in md, `text/body-md` (14) for the description.
- **Dark patch:** two divider instances stacked, one per theme, shown by `scheme/is-light` and `scheme/is-dark`; in code one divider in `popconfirm/divider` serves both themes.
- **Content frame gap:** the content frame has `space/stack` as its gap with a single child, so it has no visible effect; it is not part of the contract.

## Anatomy, read part by part in Figma

Read layer by layer in every variant (`pc/` = `popconfirm/`). Direction and gap of every auto layout frame are given with the pieces they separate.

### Order of the pieces by side

- No arrow: root vertical [trigger | surface], gap `pc/offset` (4), centered.
- bottom: root vertical [trigger | floating]; floating vertical [arrow track | surface].
- top: root vertical [floating | trigger]; floating vertical [surface | arrow track].
- right: root horizontal [trigger | floating]; floating horizontal [arrow track | surface].
- left: root horizontal [floating | trigger]; floating horizontal [surface | arrow track].
- With the arrow, the root gap is `pc/offset` (4) between the trigger and the floating group, so the tip of the arrow sits 4 from the trigger; the cross axis aligns start, center or end.
- Floating group: gap −1 px, no token: the arrow overlaps the surface outline by 1 px, so the two outlines join.
- Arrow track: on bottom and top, horizontal, left and right inset `pc/arrow-inset` (16); on right and left, vertical, top and bottom inset `pc/arrow-inset` (16). The arrow sits at the start, the center or the end of the track.

### Layers

| Layer | Direction and gap | Token and style |
|---|---|---|
| root | vertical (no arrow, bottom, top) or horizontal (right, left); gap `pc/offset` | — |
| trigger | — | `nph-button` secondary solid default, state hover-active, label = the verb of the action |
| surface | vertical, no gap, no padding | fill `pc/background`; stroke `pc/border`, `pc/border-width` on four sides; corner `pc/radius`; width `pc/width-sm` (39 variants) or `pc/width-md` (3: no arrow, md); height by content; effect `elevation/dropdown` |
| surface / content | vertical; one child | padding `pc/padding-sm` or `pc/padding-md` on four sides |
| content / text | horizontal [icon box, texts]; gap `pc/icon-gap` (8), between the box and the texts; aligned to the top | — |
| text / icon box | horizontal, hugs the icon | padding `pc/icon-box-padding` on four sides; corner `pc/icon-box-radius`; fill `pc/icon-box-background` (default), `-warning` (warning) or `-destructive` (destructive); visible with the icon on |
| icon box / icon | — | `nph-icon` solid, `circle-question` (default, 14 variants) or `triangle-exclamation` (warning and destructive, 28); size `pc/icon-size-sm` or `pc/icon-size-md`; glyph color `pc/icon-foreground`, `-warning` or `-destructive` |
| text / texts | vertical [title, description]; gap `pc/text-gap` (8) | — |
| texts / title | — | `text/heading-sm` (39 variants) or `text/heading-md` (3, md); fill `pc/title-foreground` |
| texts / description | — | `text/body-md`; fill `pc/description-foreground`; visible with the description on |
| surface / footer | vertical [divider, actions], no gap | — |
| footer / divider | vertical, two instances, one per theme | `nph-separator` horizontal; height `border/width`; line stroke `pc/divider` by override |
| footer / actions | horizontal [Cancel, Confirm]; gap `pc/actions-gap` (12); aligned to the end, centered vertically | padding `pc/footer-padding-sm` or `pc/footer-padding-md` on four sides |
| actions / Cancel | — | `nph-button` secondary solid default, label "Cancel" |
| actions / Confirm | — | `nph-button` primary solid default (default and warning) or danger solid default (destructive) |
| arrow (36 variants with the arrow) | — | width `pc/arrow-width` and height `pc/arrow-height` on bottom and top; on right and left the base is vertical (width `pc/arrow-height`, height `pc/arrow-width`) |
| arrow / fill | vector | fill `pc/background` |
| arrow / outline | vector | stroke `pc/border`, weight `pc/border-width` |

### Example texts in Figma (translated in the prose)

- Default: title "Send for approval?"; description "The manager gets the request and you cannot edit until the answer."; trigger and Confirm "Send"; icon `circle-question`.
- Warning: title "Leave without saving?"; description "The changes since the last save are lost." (in the matrix: "The changes to this item are lost."); trigger and Confirm "Leave"; icon `triangle-exclamation`. The example is limited to a small loss, the editing of one item (item 7).
- Destructive: title "Delete this file?"; description "The file goes to the trash and leaves the folder."; trigger and Confirm "Delete"; icon `triangle-exclamation`.
- Cancel is always "Cancel". No separator, prefix or suffix in the texts. The set keeps the default type text in every variant; in each use the consumer writes the text of the action.

## Anatomy (as in Figma)

1. **Trigger** — an `nph-button` instance, secondary solid, with the verb of the action. Open, it uses the hover-active state. It sits 4 px from the surface with no arrow and 4 px from the tip of the arrow with the arrow, on the side opposite to where it opens: centered on it with no arrow; with the arrow, aligned by the start, the center or the end.
2. **Surface** — aligned to the trigger by the center with no arrow, or by the start, center or end with the arrow; background `popconfirm/background`, a very soft 1 px border in `popconfirm/border` (in light #F1F1F1, in dark translucent white), corners of 14 px, a diffuse shadow in light and none in dark. Width of 304 px in sm and 372 px in md (`popconfirm/width-sm`, `popconfirm/width-md`); the height follows the content. Padding of 16 px in sm and 24 px in md. Nothing inside it is cut.
3. **Icon** — optional (icon), at the start, aligned to the top of the text: a solid `nph-icon` in a box with corners of 8 px, with the soft background of the type. `circle-question` in the default type; `triangle-exclamation` in warning and destructive. Box of 32 px with a 16 px icon in sm; box of 40 px with a 24 px icon in md.
4. **Title** — always visible: the question about the action, 8 px to the right of the icon, aligned to the top. 16 px SemiBold in sm and 20 px SemiBold in md.
5. **Description** — optional (description): the consequence, 8 px below the title, aligned to the start, in 14 px and `popconfirm/description-foreground`.
6. **Divider** — at the top of the footer, a 1 px line from edge to edge between the text and the actions, in the same soft tone as the border (an `nph-separator` instance).
7. **Actions** — a band below the divider, aligned to the end and centered vertically: Cancel (`nph-button` secondary solid) and Confirm (primary solid; in destructive, danger solid), in that order, 12 px apart, 36 px high and 16 px around them in sm or 24 px in md.
8. **Arrow** — optional (arrow on), 16 × 8 px, points to the trigger, on the side that touches it; in the start or end alignment it sits 16 px from the corner, at the start or at the end; in center, at the center.

## Accessibility (as in Figma)

- **Contrast:** the title and the description pass 4.5:1 on the surface in both themes. The icon passes 3:1 on the box of its type (4.65:1 to 6.16:1 for the default and warning icons; the destructive icon 5.89:1 in light and 13.41:1 in dark). The border and the divider are decorative: the surface stands apart from the background by the shadow in light and by the lighter background in dark.
- **Visible focus:** the trigger, Cancel and Confirm show the focus ring of the `nph-button`. What meets the contrast is the focus border, 1 px outside the button: `focus/border` on Cancel (secondary solid), `color/primary` on Confirm in default and warning, and `color/destructive` on Confirm in destructive; in the default brand it passes 3:1 against the surface in both themes. The halo around it is decoration. The surface takes no ring. In dark, in the brands Gerencial, `Educação`, Igrejas and Recursos Humanos, the focus border of Confirm in default and warning (primary) is below 3:1 (a WCAG 1.4.11 AA failure: 1.83:1, 2.57:1, 2.28:1 and 1.94:1; 4.59:1 in the default brand); the fix goes to the `nph-button`, in a task of its own, with a focus border per brand and scheme, separate from `color/primary` (item 10). The hook the `nph-button` already offers for this case is pending decision D-1 of the task (see "What the popconfirm asks of other pieces").
- **Color is not the only signal:** the type does not depend on color only: the shape of the icon separates a question (`circle-question`) from an alert (`triangle-exclamation`), and Confirm says the verb of the result, such as Delete. Open, the trigger carries `aria-expanded="true"`; hover-active is an extra signal.
- **Touch target:** the trigger, Cancel and Confirm are 36 px high (`control/height-default`), above the minimum of 24 × 24 px, in both sizes.
- **Accessible name:** the surface is named by the title (`aria-labelledby`) and described by the description (`aria-describedby`), with `role="alertdialog"` and no `aria-modal` (item 8). The trigger has text or `aria-label`. The icon and the arrow are decorative (`aria-hidden`). On open, the focus goes to Cancel in destructive and warning, and to Confirm in default.
- Usage demonstration in light and dark: focus on the trigger, closed; open, with the trigger in hover-active and the surface visible; destructive, initial focus on Cancel; default, initial focus on Confirm.

## Properties, variants and states (as in Figma)

| Field | Rule |
|---|---|
| type | default (the default of the axis), warning or destructive. It changes the icon, the background of the icon box and Confirm: primary solid in default and warning, danger solid in destructive. |
| side | bottom (default), top, right or left. Where the surface opens relative to the trigger; it varies only with the arrow. |
| alignment | start, center (default) or end. How the surface aligns to the trigger on the chosen side; it varies only with the arrow. |
| arrow | off (default) or on. With the arrow, the tip points to the trigger. |
| size | sm (default) or md. In sm: width of 304 px, padding of 16 px, title of 16 px and icon box of 32 px. In md: 372 px, 24 px, 20 px and 40 px. The height follows the content. |
| combinations | With no arrow, the set varies the type and the size, and the position is resolved by the code. With the arrow, it varies the type, the side and the alignment, in the sm size. |
| icon, description | They turn the icon and the description on and off; both come on. With no description, the title becomes the whole message. |
| title text, description text | Texts of the surface; the title is always visible. The set carries the default type text in every variant: in each use, replace it with the text of the action, with the question in the title and the consequence in the description. |
| actions and trigger | Not properties: they are `nph-button` instances inside each variant. The label of Confirm and of the trigger is the verb of the action, changed on the instance; loading comes from the `nph-button` loading state. |
| open, color, divider and shadow | Not properties: closed, only the trigger shows; open, the trigger in hover-active and the surface show. Color, border, divider and shadow come from the surface tokens and the shadow style. |

Usage demonstration in light and dark: default type, no arrow, sm; warning type, arrow on, side top, alignment start; destructive type, arrow on, side right, alignment center.

## Relations and context (as in Figma)

It combines with the `nph-button` (trigger and actions), the `nph-icon` (type icon) and the `nph-separator` (divider of the actions), which come in by instance; the surface belongs to the popconfirm itself, with `popconfirm/*` tokens; the title and the description are text of the popconfirm itself. The popconfirm controls the position, the opening and the focus; each button controls its own color and its own state. It is of the same family as the `nph-popover` and the `nph-hover-card`: same surface, border and shadow.

| Space | Token |
|---|---|
| trigger → surface | 4 px (`popconfirm/offset` → `core/space/100`). With the arrow, the tip sits 4 px from the trigger. |
| padding | 16 px in sm (`popconfirm/padding-sm` → `space/container-padding`) and 24 px in md (`popconfirm/padding-md` → `core/space/600`). |
| icon → title | 8 px (`popconfirm/icon-gap` → `space/inline`). |
| title → description | 8 px (`popconfirm/text-gap` → `space/stack-snug`). |
| between the action buttons | 12 px (`popconfirm/actions-gap` → `space/inline-loose`). The divider separates the text from the actions; the actions have 16 px around them in sm and 24 px in md (`popconfirm/footer-padding-sm` → `space/container-padding`; `popconfirm/footer-padding-md` → `core/space/600`). |

Usage demonstration: trigger, surface and actions, md size, light and dark.

## When to use (as in Figma)

Use it when the action comes from an item of the page, fits a short question and can be undone, even with effort, or loses little: delete a row (it goes to the trash), leave the editing of one item with changes, send a request. Choose the type by the consequence: default to confirm a step that changes the state, such as sending; warning when the person may lose a small piece of work, such as the editing of one item; destructive when something goes away. Choose no arrow by default; use the arrow when the trigger sits among other buttons. The default size is sm; use md when the question and the consequence need more width. Turn the description off only when the title already says the consequence.

It does not replace the `nph-dialog`, for a serious or irreversible action or one that needs a long explanation (for the serious or irreversible action, with a danger button), nor the `nph-popover` (a form or a setting). For a light action that is undone right away, do the action and offer Undo in the `nph-notification`.

Use it before an action tied to an item of the page, such as deleting a row, leaving the editing of one item or sending a request. It opens when the trigger is activated; it closes with Cancel, Esc, a press outside or the confirmed action. With Cancel, Esc or the action, the focus goes back to the trigger or, if it is gone, to the next logical element; on a press outside, the focus stays where the person pressed.

Usage demonstration in light and dark: default, sm; warning, sm; destructive, md.

## Required examples (in Figma, light and dark)

1. Delete a spreadsheet from the list (recoverable from the trash): destructive, md, initial focus on Cancel. Title "Delete the March spreadsheet?"; description "The spreadsheet goes to the trash and leaves the project list."
2. Leave the editing of one item with changes: warning, sm.
3. Send a request for approval: default, sm, no arrow.

## Do (as in Figma)

- Write the title as a question about the action. Reason: it names the surface for the screen reader and says what will happen.
- Use on Confirm the verb of the result, such as Delete or Send. Reason: the person decides without rereading the question.
- Prefer no arrow. Reason: the link to the trigger is already clear by proximity; use the arrow only when the trigger sits among other buttons.
- Give the focus back to the trigger on close with Cancel, Esc or the action or, if it is gone (deleted item), to the next logical element; on a press outside, leave the focus where the person pressed. Reason: the person carries on from where they were.
- Choose the type by the consequence and keep the destructive type for what goes away. Reason: the danger Confirm loses strength if it shows in every confirmation.

Usage demonstration: the verb of the result on Confirm, destructive type, light and dark.

## Do not (as in Figma)

Each row with the wrong example in light and dark, labeled "error, on purpose".

- Do not use Yes and No on the buttons. Instead: Cancel and the verb of the result, such as Delete.
- Do not use the default type to delete. Instead: the destructive type, with the alert icon and the danger Confirm.
- Do not use it for a light action that is undone right away, such as archiving. Instead: do the action and offer Undo in the `nph-notification`.
- Do not use it for a serious, irreversible action or one that needs a long explanation. Instead: the `nph-dialog`, with a danger button for the serious or irreversible action.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG Alert Dialog pattern (https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) and the Dialog (Modal) pattern (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), with the family of floating layers anchored to a trigger (`nph-popover`, DSA-67). The APG describes the alertdialog as modal; the popconfirm does not make the page inert, and the rows marked "no" in the APG column come from the family, the platform or the market, each with its source or its decision.

| Topic | Rule | In the APG? |
|---|---|---|
| Role and name | `role="alertdialog"`, named by the title (`aria-labelledby`) and described by the description (`aria-describedby`); no `aria-modal` (item 8). The icon and the arrow are `aria-hidden`. | In part: the APG asks `aria-modal="true"` on the alertdialog (item 8). |
| Open | Only by click, Enter or Space on the trigger; never by hover or by focus. Open, the trigger carries `aria-expanded="true"` and the hover-active state (the `nph-popover` contract, DSA-67 D-2); `aria-controls` follows DSA-67 D-3, open. | Yes (APG Button pattern). |
| Focus on open | In destructive, the focus goes to Cancel; in default, to Confirm; in warning, to Cancel. | Yes: the APG puts the focus on the first focusable element, recommends the least destructive action on a final step that is hard to undo (destructive, and warning, which loses work that costs to redo; a small loss, by item 7) and the most used button when the dialog only continues a process (default: Confirm; sending for approval deletes nothing and the answer returns it for editing, so it is the "continue processing" case). Semi follows the same rule (https://semi.design/en-US/feedback/popconfirm). |
| Tab and Shift+Tab | They move only between Cancel and Confirm while the layer is open (item 8). Enter or Space activate the focused button. | Yes (the focus stays inside the dialog). |
| Esc | Closes as Cancel and gives the focus back to the trigger. While Confirm loads: pending decision D-3 of the task. | Yes. |
| Press outside | Closes as Cancel, without giving the focus back to the trigger: the focus stays on the element the person pressed (item 9; it changes the family rule written in DSA-67, line 80). While Confirm loads: pending decision D-3 of the task. | No: the APG does not cover a press outside; family rule of the `nph-popover` (DSA-67); item 9 follows Radix, Floating UI and PrimeNG. |
| Focus on close | Back to the trigger (on a press outside, where the person pressed, item 9). If the trigger is gone (the item was deleted), to the next logical element, such as the next row or the list title; how the consumer names it is the API open point of the task. While Confirm loads: pending decision D-3 of the task. | Yes (the APG asks to return the focus to the trigger or to a logical place). |
| Slow confirm | Confirm takes the loading state and the layer stays open; on success it closes; on failure it stays open (if it was not closed during the wait, pending decision D-3) and the loading leaves. A repeated press on the loading Confirm does nothing (the `nph-button` loading state). Figma draws Cancel enabled beside the loading Confirm; what Cancel, Esc, a press outside and another layer do while it loads is pending decision D-3 of the task. | No: market rule (https://semi.design/en-US/feedback/popconfirm). |
| One layer at a time | Opening another popconfirm, popover or menu closes the open one. While Confirm loads: pending decision D-3 of the task. | No: family rule of the `nph-popover` (DSA-67). |
| Pointer and focus | Hover paints the button and does not move the focus. | No: platform rule, as the `nph-button`. |
| Near the window edge | It flips side when it does not fit; with the arrow, the arrow keeps pointing to the trigger. A window smaller than the layer: it stays beside the trigger and the window cuts it (DSA-68 D-4, open). The width never goes beyond the window minus 32 px of margin and the text wraps (side: https://floating-ui.com/docs/flip; width: https://floating-ui.com/docs/size). | No: position rule of the family and of Floating UI. |
| Motion | Enters in `popconfirm/enter-duration` (250 ms) and leaves in `popconfirm/exit-duration` (150 ms); with reduced motion, no animation (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). | No: platform rule (WCAG 2.3.3). |

Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest.

## Combined states (T11)

The single Nephos rule (decision log, T11): selected or checked plus disabled keeps the background and the mark under `state/disabled-opacity`; error plus disabled: disabled wins, the error border goes and only the opacity stays. In the popconfirm no piece has selected, checked or error, so the rule does not change the drawing. The disabled trigger is the disabled `nph-button` and does not open the layer; the action buttons follow the `nph-button` state.

## Order and alignment of the parts (appendix)

- No arrow: trigger on top and surface below, 4 px apart (`core/space/100`), centered on each other; the code positions by the side (bottom by default).
- With the arrow: trigger and layer in the order of the side (bottom: trigger, arrow, surface; top: surface, arrow, trigger; right and left, in a row), 4 px apart; the trigger and the layer align by the start, the center or the end. The arrow track is 8 px; the arrow sits 16 px from the corner (`core/space/400`) in start and end, and at the center in center.
- Surface: content on top and footer below, no gap between them.
- Content: padding of 16 px in sm and 24 px in md on the four sides; inside, the text in a row: the icon box at the start, aligned to the top, and the texts to the right, 8 px apart.
- Texts: title on top and description below, 8 px apart, aligned to the start.
- Footer: a divider from edge to edge on top; actions below, in a row, aligned to the end and centered vertically, Cancel before Confirm, 12 px apart.
- Sizes and parts read from the piece.

## Icon and image

| Type | Icon | Weight | Size | Color | Box |
|---|---|---|---|---|---|
| default | `circle-question` | solid, fixed (the surface has no hover) | 16 px (`icon/size-sm`) in sm; 24 px (`icon/size-lg`) in md | `status/info` | `status/info-surface`; 32 px in sm and 40 px in md, radius 8 px |
| warning | `triangle-exclamation` | solid, fixed | same | `status/warning` | `status/warning-surface`; same |
| destructive | `triangle-exclamation` | solid, fixed | same | `color/destructive-on-surface` (item 3; before, `color/destructive-text`) | `color/destructive-surface`; same |

Icon only through the `nph-icon` (Font Awesome), inside a box with 8 px of padding (`core/space/200`). The buttons take no icon. No image: the popconfirm takes no photo or illustration, so there is no export size and no crop. In code the color and the size come from the `popconfirm/*` tokens above (`popconfirm/icon-foreground*`, `popconfirm/icon-size-*`).

## Limits (the "Limites" row of the Figma matrix)

Each case shows the piece or says why it does not apply, with the number of lines of the title and the description at 304 px (sm) and 372 px (md).

- Minimum: only the title and the actions (icon and description off), sm: title on 1 line, no description.
- Maximum: a long description in sm: title on 1 line, description on 4 lines.
- Long text: a long title in sm: title on 2 lines, description on 2 lines.
- Long text: a long label on a button, it fits in sm (the buttons take 252 px of the 270 px usable in the footer): title on 1 line, description on 2 lines.
- Empty: does not apply. The title is the question and is required. With no title there is nothing to confirm.
- Many items: does not apply. There are always two actions, Cancel and Confirm. More actions call for an `nph-popover` with a footer or an `nph-dialog`.
- Short window: no room below, it flips up (the width limited to the window is the rule above): title on 1 line, description on 2 lines.

Usable width of the footer in sm: the actions band is 302 px inside the 1 px border (304 − 2); minus 16 + 16 of padding, 270 px are left.

Not drawn: actions that do not fit, with a long or translated label or in a narrow window (at 320 px the surface is 288 px and about 254 px are usable), including a single label longer than the usable band, which the `nph-button` keeps on one line. It is pending decision D-2 of the task, with a recommendation (stack the buttons, Confirm on top) and its sources; the Figma preview is on the draft page (node 7910:23035).

Not drawn either: what Cancel, Esc, a press outside and opening another layer do while Confirm loads (Figma draws Cancel enabled beside the loading Confirm). It is pending decision D-3 of the task, with a recommendation and a source.

## What the popconfirm asks of other pieces

Read on `v/5.0.0` (the spec and the code of each piece):

- **`nph-button`** — secondary solid, primary solid and danger solid, size default (36 px): yes. The open trigger look: yes, for a trigger that carries `aria-haspopup` (`fichas/nph-button.md`, hover-active state, "the trigger of an open popover or menu keeps the look of hover-active"). The loading state for a slow Confirm: yes (`loading`). The focus ring per type: yes; the dark focus contrast of the primary Confirm in four brands is below 3:1 (item 10), a fix of the `nph-button` in a task of its own. The `nph-button` also offers a public hook for this case: the custom property `--nph-button-focus-border` (DSA-72, P116), which a piece that hosts a button on a surface where the color of the type falls below 3:1 sets on that button to `focus/border`, as the `nph-sidebar` close button does (`fichas/nph-button.md`, focus and "Feedback and focus"). With `focus/border` the border measures 5.53:1 (Gerencial), 9.82:1 (`Educação`), 5.98:1 (Igrejas), 5.67:1 (Recursos Humanos) and 7.88:1 (default brand) on `color/popover` in dark (review of 2026-11-19). Item 10 was answered without this hook, so setting it on the Confirm is pending decision D-1 of the task, with a Figma preview to come; until it is answered, the Confirm keeps the focus border of its type. The `nph-button` spec names three brands at this limit; the Figma reading gives four (with `Educação`).
- **`nph-icon`** — `circle-question` and `triangle-exclamation` in solid: yes (`nph-icon.icons.ts`). Color from `currentColor` and size from `icon/size-*`: yes; the popconfirm sets them with its tokens.
- **`nph-separator`** — a horizontal 1 px line in `border/width`: yes. Its color is fixed at `color/border` and its CSS has no color hook (`fichas/nph-separator.md`, lines 37 and 41): it does not give `popconfirm/divider` (`color/border-subtle`). Open point in the task, with the path: set the color of the separator the popconfirm holds, or draw its own 1 px line, as the `nph-popover` footer divider (`.divider` part, `popover/divider`) does.
- **`nph-popover`** — the family: surface, border, shadow, position by side and alignment, the arrow one arrow height further (DSA-67 D-1), flip to the opposite side, one layer at a time, the trigger wiring (`for`, `aria-haspopup`, `aria-expanded`, `aria-controls`). It already does them for its own surface. Differences the popconfirm asks for: `role="alertdialog"` instead of a non-modal `dialog`; the Tab kept between Cancel and Confirm (the popover lets the Tab leave and closes on focus out); the initial focus by type (the popover goes to the first focusable element); no close button; default buttons of 36 px (the popover footer uses compact buttons, which go back to default on touch); the icon box; fixed widths 304 and 372 (popover 240, 320, 400). A press outside: the popover spec already leaves the focus where the person put it (`fichas/nph-popover.md`, business rules), as item 9; the DSA-67 task text (line 80) still says the focus returns to the trigger. Two family rules of the popover spec that the popconfirm keeps: Esc closes only the top layer and does not reach a dialog around it, and the surface is inert while it leaves; inside an `nph-dialog` the popover is not part of the contract yet, and neither is the popconfirm.

## Inherited decisions

- Follows DSA-03 and DSA-13: no D-N; `circle-question` exists in the solid style; the `nph-button` contract `461:13009` and the `nph-icon-button` contract `498:15671`.
- Follows DSA-47 D1 and DSA-52: an icon-only button swaps to solid in hover-active (applies to an example trigger with `nph-icon-button`); the DSA-47 D1 question stays open, with no effect here.
- Follows DSA-60: the hover of the ghost secondary in `color/accent`.
- Follows, by analogy, DSA-64 D-1: the solid secondary Cancel keeps its own background inside the layer; open in the task.
- Follows DSA-67 D-1 (the tip of the arrow 4 px from the trigger), D-2 (the open trigger in `button/secondary-solid-background-hover` with `aria-expanded`) and D-3 (`aria-controls` points to the host, when it comes); open in the tasks.
- Follows in part DSA-67 D-4 (title in `text/heading-sm`): sm follows (16 px); md uses `text/heading-md`, 20 px.
- Follows in part point 20 of the `nph-popover` contract (compact buttons of 28 px): the buttons are 36 px, `control/height-default`, in both sizes.
- Follows DSA-68 D-2 (no arrow, centered on the trigger; with the arrow, 16 px from the corner) and D-4 (a window smaller than the layer); D-1 (media) and D-3 (link) do not apply.
- Follows DSA-88 decision 2 (outline and divider in `color/border-subtle`).
- Follows in part DSA-88 decisions 4 (the icon box uses the background of the type, not primary), 6 (footer of 24 px in md and 16 px in sm; 12 px between the actions, by point 21 of the `nph-popover` contract), 7 and 8 (same value, another variable: `core/space/600`, and `radius/inset` on the box radius, as the `nph-card` icon box), 11 (the md title follows; the sm one stays at 16 px) and 15 (the divider always on, because there are always two actions).
- Follows DSA-88 decision 9 (the icon box padding in `core/space/200`).
- DSA-44 D3 (the highlight icon of the `nph-dialog`: shape, size and place), open in that task: the popconfirm does not depend on it and defines the icon by type; if it is answered, the two align.
- Do not apply: DSA-43 D1 and D2, DSA-88 decisions 1, 3, 5, 10, 12, 13, 14, 16, 17, 18, 19 and 21.

## Decisions answered (approval page of 2026-11-19, items 1 to 10, all as recommended)

1. Documentation `7389:104` accepted.
2. Width: fixed, 304 px in sm and 372 px in md, on the new `core/layout-width/popconfirm-sm` and `-md` (option A; the design owner drew 302; B, 302, left the grid of 4; C and D used the `popover-*` widths, which say "do not consume directly").
3. Destructive icon: `popconfirm/icon-foreground-destructive` → `color/destructive-on-surface`, in place of `color/destructive-text`, whose description says DO NOT USE over `color/destructive-surface`. Same color in light (#B01E1E); in dark a lighter red (#F1A8A8 → #F8D4D4).
4. Icon box backgrounds: default and warning keep the icon in `status/info` and `status/warning` on `status/info-surface` and `status/warning-surface`; destructive on `color/destructive-surface`; the three descriptions take the popconfirm icon box.
5. Icon box radius: `popconfirm/icon-box-radius` → `radius/inset`, with its description widened to "inside a card or a floating layer".
6. The md padding (`popconfirm/padding-md`, `popconfirm/footer-padding-md`) → `core/space/600` and the icon box padding (`popconfirm/icon-box-padding`) → `core/space/200`, by decision.
7. Scope: the popconfirm covers the action tied to an item that can be undone, even with effort, or loses little (for example, the trash); the serious or irreversible action goes to the `nph-dialog` with a danger button until the `nph-alert-dialog` comes back to the scope. The warning example is limited to a small loss (the editing of one item).
8. `role="alertdialog"` with no `aria-modal`, the Tab moving only between Cancel and Confirm, as the PrimeNG ConfirmPopup. A deviation from the APG, which treats the alertdialog as modal. Caveat: the reading in NVDA, JAWS and VoiceOver has no read source.
9. Focus after a press outside: Esc and the actions (and the close button of the `nph-popover`) give the focus back to the trigger; a press outside closes and leaves the focus where the person pressed, in the `nph-popconfirm` and in the `nph-popover` (the `nph-hover-card` takes no focus, DSA-68). Caveat: a press on an area with no focusable element has no read source. The DSA-67 text (line 80) changes with the nph-popover code, not in this task.
10. The dark focus contrast of the primary Confirm in four brands: accepted in the popconfirm as inherited from the piece; the fix goes to the `nph-button`, with a semantic `focus/border` per brand and scheme, separate from `color/primary`, in a task of its own. The hook the `nph-button` already offers for this case was not on the page: it is pending decision D-1 of the task.

Origin of the points of the appendix that were not items of the approval page (P35): they follow the recommendation, approved with the page. Tokens with no new value: the 22 alias semantics and, by decision, `popconfirm/radius`, `popconfirm/offset`, `popconfirm/arrow-width`, `popconfirm/arrow-height` and `popconfirm/arrow-inset`, as the `popover/*` of DSA-67. Behavior and look already on the accepted root: the `circle-question` icon in the default type; the actions band with the divider; 8 px between the icon and the text; tokens of its own, not an `nph-popover` instance; 16 px of padding in sm; the icon box, the 20 px md title and the 36 px buttons; bottom as the default side, as the family; the width never beyond the window minus 32 px; the initial focus of the warning type on Cancel, as the destructive one, by the APG rule (the PrimeNG focuses Confirm by default).

## Hidden on purpose in Figma

- The divider "dark" in light and the divider in dark (visible bound to `scheme/is-dark` and `scheme/is-light`): one divider in code.
- The icon and the description when their switch is off.
