```json
{
  "task": "DSA-87",
  "gate": "figma-docs-accepted",
  "date": "2026-11-16",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=5173-1429",
    "date": "2026-11-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The design owner gave the visual acceptance of the nph-carousel root (5164:663), and its documentation frame (5173:1429, page 1626:32) was accepted, with COMPONENT_SET nph-carousel (5165:1094), COMPONENT_SET nph-carousel indicators (5164:771) and COMPONENT_SET nph-carousel indicator (5164:687). In a test round of 16-11 without the approval page, the 15 approval items were taken as recommended, none rejected: (1) documentation 5173:1429 and appendix accepted; (2) carousel/indicator-background points to color/subtle-foreground, whose description now names the non-current position marker; (3) carousel/indicator-background-current points to color/primary-border, whose description now allows a small position or progress marker; (4) carousel/control-foreground points to color/muted-foreground, for the arrow icon, with no change to the nph-icon-button; (5) carousel/indicator-size, carousel/indicator-width-current and carousel/indicator-target-size point straight to core/space/200, core/space/300 and core/target-size/minimum; (6) carousel/peek-size points straight to core/space/700; (7) carousel/slide-gap points to space/inline (8); (8) radius/full names the position marker (dot or pill) and the circular target, and radius/subtle names the bar indicator; (9) the indicators are a tab group (one Tab stop, arrows between them), and in the several layout each one stands for a page; (10) above five slides the indicators go off and the counter goes on (in the several layout it counts pages); (11) with two slides, do not use the carousel and show both together; only without room, use arrows and indicators with two items; (12) automatic rotation, vertical and thumbnails stay out of v1; (13) focus uses the focus tokens directly, and the arrow hover stays as the nph-icon-button hover; (14) in the several layout the number of whole slides comes from the container width, at least one; (15) the slide image is exported at 2x (512 x 288 for 256 x 144), cropped to 16:9 from the center. The specification, converted to text, is in this evidence."
  }
}
```

# DSA-87 — `figma-docs-accepted`

The documentation of the nph-carousel (frame `5173:1429`, page `1626:32`) was accepted in Figma in the file `DS-IA-NEPHOS 5.0`, with the visual acceptance of the root `5164:663`. It is a strip of slides where only one part shows at a time; the person moves from one slide to another with the arrows, the indicators or by dragging. Its tokens came with this task and are on `v/5.0.0`.

What changed in the tokens with this task:

- New component group `carousel/*`, 14 tokens in the semantic collection. Ten alias semantics (rule 2 of T9). Four point straight to the core by decision (rule 3 of T9): `carousel/indicator-size` (`core/space/200`), `carousel/indicator-width-current` (`core/space/300`), `carousel/indicator-target-size` (`core/target-size/minimum`) and `carousel/peek-size` (`core/space/700`). The semantics with the same value do not serve: `space/inline`, `space/stack-snug`, `space/control-padding` and `space/inline-loose` are spaces, `radius/container` is a container corner, `layout/columns` is the grid column count, `layout/gutter` and `layout/margin-default` are grid spaces, `icon/size-lg` is an icon box and `space/section` is the space between page sections; none has the function of a marker size, a hit target or a peek.
- No new value entered the core (rule T9).
- Descriptions changed, in Figma and in `design.md`: `color/subtle-foreground` (also a non-current position marker), `color/primary-border` (exception: a small position or progress marker, as `progress/indicator-background` already does), `radius/full` (also a position marker, dot or pill, and a circular target), `radius/subtle` (bar indicator). The radius selection table in `design.md` (section 2d) follows.
- Extended `use` in `design.md`: `color/accent`, `color/muted-foreground`, `space/inline`, `space/stack`.
- Left without a component token (decided, item 13): focus (`focus/border`, `border/width`, `focus/halo`, `focus/ring-width`); the arrow keeps the tokens of the nph-icon-button; the slide content keeps the tokens of nph-image and nph-skeleton.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component sets.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma, between backticks. Where a point is not one of the 15 approval items, it follows the recommendation of the appendix, accepted with the documentation (item 1).

## Purpose

Shows a sequence of slides of the same kind, one part at a time, for the person to go through at their own pace.

Use it for a short sequence of similar content where seeing one slide at a time is enough: image gallery, featured cards, welcome steps. The slide takes any approved content and has no background, outline or radius of its own: the content brings its own.

It does not replace a list or a grid, when the person needs to see or compare everything; the nph-pagination, which splits a long list into pages; the nph-tabs, which separate named sections; nor the nph-progress, which shows the progress of a task. Do not hide important content in a carousel: a slide out of view is rarely seen.

Selection in Figma: `layout`, `posição` (position), `setas` (arrows), `indicadores` (indicators) and `contador` (counter) on the carousel; `itens` (items) on the indicators instance; `atual` (current) and `estado` (state) on the indicator.

## Component sets

| Set | Figma id | What it is |
|---|---|---|
| nph-carousel | `5165:1094` | `layout` (`único` one slide, default; `vários` several; `espiada` peek) × `posição` (`início` start, default; `meio` middle; `fim` end), and the booleans `setas` (on), `indicadores` (on) and `contador` (off). 9 variants: `5165:721`, `5165:761`, `5165:801` (one slide); `5165:845`, `5165:890`, `5165:935` (several); `5165:981`, `5165:1027`, `5165:1073` (peek). |
| nph-carousel indicators set (`nph-carousel / indicadores`) | `5164:771` | `itens` (`2`, `3` default, `4`, `5`) × `posição` (`início`, `meio`, `fim`; with 2 items only `início` and `fim`). 11 variants: `5164:688`, `5164:695`, `5164:702` (3); `5164:709`, `5164:718`, `5164:727` (4); `5164:736`, `5164:747`, `5164:758` (5); `6855:2989`, `6855:2993` (2, added with item 11). Use only inside the nph-carousel. |
| nph-carousel indicator set (`nph-carousel / indicador`) | `5164:687` | `atual` (`não` default, `sim`) × `estado` (`padrão` default, `hover`, `foco`). 5 variants: `5164:671` not current · default, `5164:673` not current · hover, `5164:675` not current · focus, `5164:679` current · default, `5164:681` current · focus. The current one has no hover: it does not lead anywhere new. |

## Tokens

| Token | Points to | Light | Dark | Where |
|---|---|---|---|---|
| `carousel/indicator-background` | `color/subtle-foreground` | `core/neutral/500` | `core/neutral/300` | Non-current marker (dot) |
| `carousel/indicator-background-current` | `color/primary-border` | `theme/brand-600` | `theme/brand-200` | Current marker (pill), brand tone |
| `carousel/indicator-target-background-hover` | `color/accent` | `core/surface/50` | `core/surface/600` | Background of the non-current indicator target in hover (no background in the other states) |
| `carousel/indicator-size` | `core/space/200` | 8 | 8 | Side of the dot; height of the pill |
| `carousel/indicator-width-current` | `core/space/300` | 12 | 12 | Width of the current pill |
| `carousel/indicator-target-size` | `core/target-size/minimum` | 24 | 24 | Hit target of each indicator, 24 × 24 (WCAG 2.5.8) |
| `carousel/indicator-radius` | `radius/full` | full | full | Corner of the dot and the pill |
| `carousel/indicator-target-radius` | `radius/full` | full | full | Corner of the indicator target and of its focus border and halo: a circle |
| `carousel/control-foreground` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Chevron of both arrows, by override on the nph-icon-button instance |
| `carousel/counter-foreground` | `color/muted-foreground` | `core/neutral/600` | `core/surface/200` | Counter text, text style `text/label-md` |
| `carousel/slide-gap` | `space/inline` | 8 | 8 | Gap between slides in the track |
| `carousel/control-gap` | `space/inline` | 8 | 8 | Gap between arrows, indicators and counter in the controls bar |
| `carousel/controls-offset` | `space/stack` | 16 | 16 | Gap between the track and the controls bar |
| `carousel/peek-size` | `core/space/700` | 32 | 32 | How much of the neighbor slide shows at the edge in the peek layout |

### Used directly or by instance (decided, item 13)

- Focus of the indicator: border `focus/border` with thickness `border/width`, outside the target, and halo `focus/halo` with thickness `focus/ring-width` beyond it; both with the corner `carousel/indicator-target-radius`. The border carries the 3:1; the halo is decoration.
- Arrow: the nph-icon-button `secondary`, `solid`, `default`, circular, with its own tokens (`icon-button/secondary-solid-background` and `-hover`, `control/height-default`, `radius/full`, `state/disabled-opacity`, `icon/size-md`, its focus). Only the icon color is overridden, to `carousel/control-foreground`. The hover of the arrow stays as the nph-icon-button hover; "review the hover contrast" is a note for a future review of the nph-icon-button, not for this task (item 13).
- Slide content (example only): nph-image size media (`image/media-width`, `image/radius-lg`, `image/border-width`, `image/border`, `image/background`) and nph-skeleton lines (`skeleton/line-height`, `radius/inner`, `color/muted`); the example slide stacks them with `space/stack-snug`.

## Anatomy, read part by part in Figma

Read by script, variant by variant, after the token bindings (16-11).

1. **Track**: the strip that shows the slides side by side and clips what goes past the width. Top of the carousel, full width; horizontal, slides aligned to the start and the top; gap `carousel/slide-gap`.
2. **Slide**: receives the content; no background, outline or radius of its own. Content aligned to the start and the top. In Figma the slide is 256 × 192 (an nph-image 256 × 144 and two skeleton lines).
3. **Peek** (peek layout only): the edge of the neighbor slide, the height of the track, `carousel/peek-size` wide. At the start and in the middle the next slide shows, after the current one; at the end, the previous one, before it.
4. **Controls bar**: the row below the track, full width of the carousel, content centered on both axes, gap `carousel/control-gap`. Order: previous arrow, indicators, next arrow, counter. The carousel root stacks track and bar with `carousel/controls-offset`.
5. **Arrow**: nph-icon-button secondary, solid and circular (36 × 36), with a chevron one tone softer than the button default (`carousel/control-foreground`). Centered on the row height: the previous arrow opens the row and the next one comes after the indicators.
6. **Indicators**: one per slide, touching each other (each 24 × 24 target touches its neighbor, gap 0), centered on the row height. The current one is wider and has the brand color; the marker sits at the center of the target.
   - Indicator target: 24 × 24 (`carousel/indicator-target-size`), circle (`carousel/indicator-target-radius`); no background at rest; `carousel/indicator-target-background-hover` in hover (not current only).
   - Marker: dot 8 × 8 (`carousel/indicator-size`) in `carousel/indicator-background`; current: pill 12 × 8 (`carousel/indicator-width-current` × `carousel/indicator-size`) in `carousel/indicator-background-current`; corner `carousel/indicator-radius`.
   - Focus (not current and current): focus border 26 × 26 and halo 34 × 34 around the target (see "Used directly").
7. **Counter**: the text "position of total" (the Figma example reads "2 of 5" in Portuguese), after the next arrow, centered on the row height, text style `text/label-md`, color `carousel/counter-foreground`. Off by default.

Widths in Figma: one slide 256, several 520 (two slides and one gap), peek 296 (one slide, one gap and the peek).

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The indicator (`carousel/indicator-background`) and the current indicator (`carousel/indicator-background-current`) pass 3:1 over `color/background`, `color/card` and `color/muted`, in every brand and both modes. The arrow icon (`carousel/control-foreground`) passes 3:1 over the arrow background, at rest and in hover. The counter is text and passes 4.5:1. The disabled arrow is exempt. |
| Visible focus | The arrow and the indicator show the `focus/border` border around the piece, outside, over the page background, and the `focus/halo` halo beyond it. The border carries the 3:1; the halo is decoration. With focus, the indicator has no hover background, because the border does not pass 3:1 over the hover background (`carousel/indicator-target-background-hover`). |
| Focus between indicators | The indicator targets touch. Near the touch point, the focus border goes a little into the neighbor target; if that one is in hover, the border loses contrast in that stretch. The rest of the border stays over the page background. |
| Color is not the only cue | The current indicator is wider than the others, besides the color. With no wrap-around, the arrow on the side with no slide is disabled at the start and at the end. |
| Target size | The arrow has the default control height, `control/height-default`. The indicator has the target `carousel/indicator-target-size` around the small marker (WCAG 2.5.8): the dot is `carousel/indicator-size`, and the current one stretches to `carousel/indicator-width-current`. |
| Alternative to dragging | Arrows and indicators move the slide with one tap. So at least one of the two stays on (WCAG 2.5.7). |
| Accessible name | Each arrow has a name by `aria-label`, such as "Previous slide" and "Next slide", and the icon has `aria-hidden`. The indicators form a tab group: one Tab stop and arrows between them (item 9). Each indicator has a name with its position, such as "Slide 2 of 5"; in the several layout each one stands for a page, such as "Go to page 2". Each slide announces itself as "position of total" in the several layout too (appendix, item 10). Keyboard, roles and screen reader output live in the repository. |

Measured contrast (lowest ratio among the 7 brands; light / dark), read in the appendix:

- `color/subtle-foreground` (indicator) over `color/background` 4.74 / 8.23; over `color/card` 4.74 / 6.95; over `color/muted` 4.08 / 5.54; over `color/accent` (hover) 4.08 / 4.28. Passes 3:1.
- `color/primary-border` (current indicator) over `color/background` 4.96 / 4.91; over `color/card` 4.96 / 4.14; over `color/muted` 4.27 / 3.31. Passes 3:1. Over `color/accent` 4.27 / 2.56: fails, so the current one has no hover.
- Current against another: 1.13 / 1.09. The cue is the width (WCAG 1.4.1).
- `focus/border` over `color/background` 4.32 / 4.91; over `color/card` 4.32 / 4.14; over `color/muted` 3.72 / 3.31. Passes 3:1. Over `color/accent` 3.72 / 2.56: fails, so with focus the indicator has no hover background.
- Arrow: icon `color/muted-foreground` over `icon-button/secondary-solid-background` 5.75 / 5.10; over the hover background 4.91 / 3.91. Passes 3:1.
- Counter (text, needs 4.5:1): `color/muted-foreground`, 5.76 / 5.11 over the page.

## Properties, variants and states

| Field | Rule |
|---|---|
| `layout` | `único` (one slide): one whole slide at a time. `vários` (several): slides side by side, as many whole slides as fit the container width, at least one; the slide does not shrink nor get cut in the middle, and in a container narrower than one slide the single slide follows the width (item 14). `espiada` (peek): the whole current slide and the edge of the neighbor; at the start and in the middle the next one shows; at the end, the previous one. Default: `único`. |
| `posição` (position) | Where the current slide is: `início` (start), `meio` (middle) or `fim` (end). With no wrap-around, the previous arrow is disabled at the start and the next one at the end. In the middle both are active. Default: `início`. |
| `setas` (arrows) | Turns both arrows on or off. Default: on. |
| `indicadores` (indicators) | Turns the indicators on or off. Default: on. At least one of arrows and indicators stays on. |
| `contador` (counter) | Shows "position of total" after the next arrow. Default: off. Turn it on when the indicators are off. |
| indicators · `itens` (items) | On the exposed indicators instance: how many slides the sequence has, 2, 3, 4 or 5; 2 only when the two slides do not fit together (item 11). |
| indicators · `posição` | Do not touch: it follows the carousel position. Changing it only there misaligns the current indicator and the disabled arrow. |
| indicator · `atual` and `estado` | current `não` (no) or `sim` (yes); state `padrão` (default), `hover` or `foco` (focus). The current one has no hover: it does not lead anywhere new. |
| Not a property | Wrap-around, dragging and transition are code behavior. With no wrap-around, the arrow on the side with no slide is disabled; with wrap-around, none is. The transition uses `motion/state-duration` and `motion/state-easing` and is instant with reduced motion. A loading slide is the nph-image in the loading state. The piece has no automatic rotation: it stays out of v1, as the vertical carousel and thumbnails (item 12). |

## Relations and context

- The slide combines with nph-image for media and with nph-skeleton while the content loads; it also takes other approved content. The arrows are nph-icon-button instances and bring from it the background, the hover, the focus and the disabled look; the icon changes to a softer tone (`carousel/control-foreground`). The indicators are a set of the carousel itself.
- The carousel controls the position: it decides the disabled arrow and the current indicator. Gaps: between slides `carousel/slide-gap`; between the pieces of the controls `carousel/control-gap`; between the track and the controls `carousel/controls-offset`; in the peek layout the neighbor shows at the edge by `carousel/peek-size`.
- The arrows stay in the bar below the track, never over the photo: over a photo neither the arrow outline nor the focus ring has guaranteed contrast. The carousel has no background or outline: it lives on the page or in a card.

## When to use

- Use peek when you want to make it clear there are more slides: it is the recommended layout, because the edge of the neighbor invites to move on. Use one slide when one at a time is enough. Use several when seeing some slides at once helps to choose.
- With three to five slides, use indicators. With more than five, turn the indicators off and the counter on: too many dots go unnoticed; in the several layout the counter counts pages (item 10). With two slides, do not use the carousel: show both together, side by side or in a list; only without room, use arrows and indicators with two items (item 11).

## Required examples (in Figma, light and dark)

- Image gallery: peek, in the middle of the sequence, with arrows and indicators. The edge of the next slide invites to move on.
- Featured cards: several, at the start. Slides side by side; the disabled previous arrow shows there is nothing before.
- A sequence with more slides than the indicators hold: indicators off and counter on, with the total (the Figma example reads "2 of 8" in Portuguese); in the several layout the counter counts pages.

## Do

- Disable the arrow on the side with no slide, at the start and at the end, when there is no wrap-around: it shows the sequence ended.
- Use slides of the same kind and the same height: the strip does not jump when the slide changes.
- Change the position on the carousel, not on the indicators instance: the disabled arrow and the current indicator tell the same story.
- Put the text below the image, not over it: contrast over a photo is not guaranteed.
- Prefer peek for featured content: the edge of the neighbor shows there is more to see.

## Do not

- Do not turn arrows and indicators off together: only dragging is left, which not everyone can do. Instead: keep at least one of the two on.
- Do not change the position only on the indicators instance: the current indicator and the disabled arrow stop matching. Instead: change the carousel position.
- Do not leave the sequence without indicators and without counter: the person does not know how many slides there are nor where they are. Instead: indicators, for two to five slides, or the counter.

## Default behavior (appendix, accepted with the documentation)

Base: the WAI-ARIA APG Carousel pattern, with no deviation, and the tabbed carousel variant for the indicators (item 9).

| Key or action | What it does | Base |
|---|---|---|
| Tab | Enters the carousel and goes through the controls in row order: previous arrow, indicators (one stop only, as a tab group) and next arrow. Links and buttons of the visible slide follow the content order. | APG Carousel, keyboard |
| Enter or Space on an arrow | Goes to the previous or next slide. At the start and the end, the arrow on the side with no slide is disabled and stays focusable, so focus does not get lost. How the arrow stays focusable with the nph-icon-button is an open point of DSA-87. | APG Carousel; APG, focusability of disabled controls |
| Left and Right arrow keys on the indicators | Move focus between the indicators and show the slide; Home and End go to the first and the last (item 9). | APG Carousel with tabs; APG Tabs |
| Click or tap on an indicator | Shows the slide of that indicator, which becomes current. | APG Carousel |
| Drag or swipe on the track | Changes the slide by touch and mouse. Never the only way: arrows and indicators do the same. | WCAG 2.5.7 |
| Focus on slide change | Focus stays on the control used and does not move to the slide. The new slide is announced politely to the screen reader, without interrupting. | APG Carousel |
| Pointer × focus | Hover only paints the target of the non-current indicator (`carousel/indicator-target-background-hover`) and the arrow background; it does not move focus nor change the slide. | APG Carousel |
| Esc and click outside | Do not apply: the carousel opens no layer. | — |
| Near the window edge | No floating layer. In a short window, see "Limits". | Limits |
| Reduced motion | The slide change is instant, with no slide animation. | WCAG 2.3.3; DSA-62 D-3 |
| Automatic rotation | Does not exist in the piece; out of v1 (item 12). If it ever returns: a pause button present and first in Tab order, stop on focus and hover, and the live announcement off while it rotates (APG). | Item 12 |
| Code | Event, aria, slot, property and console warning stay with the code, following the APG and the Custom Elements Manifest. | — |

## Combined states (T11)

T11 (same rule for every component): 1. selected or checked + disabled keeps the selected background and mark under `state/disabled-opacity`; 2. error + disabled: disabled wins and only the opacity stays. In the carousel there is no error state. The disabled arrow, at the start and the end, uses the `state/disabled-opacity` of the nph-icon-button. The set has no disabled carousel; if one ever exists, the current indicator keeps its width and brand color under `state/disabled-opacity` (rule 1). Current indicator + focus: focus border over the current one, with no hover background (`5164:681`). Current indicator + hover: no change; the current one has no hover.

## Icon and image

- Arrows: nph-icon `chevron-left` and `chevron-right`, style `light` at rest, focus and disabled; `solid` in hover and active (DSA-47 D1). Size `icon/size-md`, inside the nph-icon-button default (`control/height-default`). Sources: https://fontawesome.com/icons/chevron-left?s=light ; https://fontawesome.com/icons/chevron-right?s=light
- Image: it is slide content, not a carousel piece. The example slide uses the nph-image size media (`image/media-width`), ratio 16:9 and corner `image/radius-lg`. Export (item 15): 2x the shown width (512 × 288 for the 256 × 144 slide), cropped to 16:9 from the center, covering the box (`object-fit: cover; object-position: 50% 50%`); 3x spends data with no visible gain.

## Limits (the six cases)

- Minimum: two slides; with two, prefer to show them together, and only without room use arrows and indicators with two items (item 11).
- Maximum and many items: up to five slides with indicators; above that, indicators off and counter on (item 10).
- Long text: the carousel has only the counter as its own text; the slide text belongs to the approved content.
- Empty: does not apply; with no slides there is no carousel.
- Short window (item 14): in the several layout, the number of whole slides comes from the container width, not the screen, at least one: at 296 px one fits and two need 520 px (with the 8 of `carousel/slide-gap`); from 256 px up the slide does not shrink nor get cut in the middle; below that, the single slide follows the container width. One slide and peek show one whole slide at a time. Figma draws the several layout at 520 only; at a narrow width the Figma piece clips both slides at the edges (appendix preview), and the code follows this rule instead.

## Inherited decisions

Read by `git grep` in the DSA tasks of `v/5.0.0`. No D-N names the nph-carousel; these come from the pieces used by instance.

- nph-icon-button (DSA-43, DSA-47 D1 and DSA-52): the arrow is the icon-only button; the icon is `light` at rest, focus and disabled and goes to `solid` in hover and active. The icon color is `carousel/control-foreground` by override (item 4).
- DSA-60: the hover of the ghost secondary went to `color/accent`; the arrow uses the solid secondary, with `icon-button/secondary-solid-background-hover`, and does not change. DSA-64 D-1: inside the nph-dialog the solid secondary keeps its own background; it holds for the arrow of a carousel in a dialog.
- nph-image (DSA-51 D1): the empty image draws only the frame; a slide with no photo follows that. nph-skeleton (DSA-26 D2): the lines of the example slide use `color/muted` and `radius/inner`; they are example content.
- DSA-62 D-3: with reduced motion nothing moves.
- From the decision record: T9, tokens in three layers (table above); T11, combined states (above).
- From the decision map, line 186: "adia", changed to "entra" with this task (a finished component enters v1, rule of 06-11).
- From the adjustment of 14-11, accepted with the green light of 16-11: softer colors on the dots and the arrow icon.

## Decisions answered (test round of 16-11, all as recommended)

1. Documentation `5173:1429` and appendix accepted.
2. `carousel/indicator-background` → `color/subtle-foreground`; its description now names the non-current position marker.
3. `carousel/indicator-background-current` → `color/primary-border`; its description now allows a small position or progress marker (`color/primary` fails 3:1 in dark), as `progress/indicator-background`.
4. `carousel/control-foreground` → `color/muted-foreground`, with no change to the nph-icon-button.
5. `carousel/indicator-size` → `core/space/200`, `carousel/indicator-width-current` → `core/space/300`, `carousel/indicator-target-size` → `core/target-size/minimum`.
6. `carousel/peek-size` → `core/space/700`.
7. `carousel/slide-gap` → `space/inline` (8, not 16).
8. `radius/full` names the position marker (dot or pill) and the circular target; `radius/subtle` names the bar indicator. `carousel/indicator-target-radius` follows this item.
9. Indicators as a tab group (one Tab stop, arrows between them); in the several layout each one stands for a page.
10. Above five slides, indicators off and counter on (in the several layout it counts pages).
11. With two slides, do not use the carousel; only without room, indicators with two items and arrows (variants `itens=2` added to the indicators set).
12. Automatic rotation, vertical and thumbnails out of v1 (automatic rotation, if it returns, with a pause button first in Tab order and a stop on focus and hover).
13. Focus uses the focus tokens directly; the arrow hover stays as the nph-icon-button hover, with the note "review the hover contrast" for a future review of that component.
14. Short window of the several layout: whole slides by container width, at least one (see "Limits").
15. Slide image exported at 2x, cropped to 16:9 from the center (see "Icon and image").

Also with no decision, linked to an existing semantic and no new value: `carousel/indicator-target-background-hover`, `carousel/indicator-target-radius`, `carousel/control-gap`, `carousel/controls-offset`, `carousel/counter-foreground`. The disabled arrow stays focusable (APG, focusability of disabled controls), with no new decision.

## Sources

- Figma `DS-IA-NEPHOS 5.0`, page `1626:32`: documentation `5173:1429`, root `5164:663`, sets `5165:1094`, `5164:771`, `5164:687`
- WAI-ARIA APG, Carousel: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- WAI-ARIA APG, Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WAI-ARIA APG, focusability of disabled controls: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols
- WCAG 2.2, non-text contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, target size (minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, dragging movements: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- WCAG 2.2, pause, stop, hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- WCAG 2.2, animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Nielsen Norman Group, designing effective carousels: https://www.nngroup.com/articles/designing-effective-carousels/
- Splide, accessibility: https://splidejs.com/guides/accessibility/
- MDN, container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- MDN, responsive images: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- MDN, object-fit: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
- Custom Elements Manifest: https://github.com/webcomponents/custom-elements-manifest
- `design.md` — the tokens named in this evidence
