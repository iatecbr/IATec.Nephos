```json
{
  "task": "DSA-68",
  "gate": "figma-docs-accepted",
  "date": "2026-11-06",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=4422-2418",
    "date": "2026-11-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "Indiane accepted the nph-hover-card documentation frame (4422:2418, page 4128:31754), with the Figma UX QA and the textual audit approved, and approved the 10 points of the approval page: documentation acceptance; radius 14 straight on core, as the popover; offset 4 from the link to the card, with and without the arrow, straight on core; the arrow tokens of the popover (16 x 8, inset 16), with no arrow-offset token; width 320 on core/layout-width/popover-md; color/subtle-foreground as a new semantic token for the meta line; 8 between title, description and meta on space/stack-snug; open after 600 ms (new core/duration/delay-long) and close after 300 ms; relative time up to 30 days, then the date; the clock icon for the updated phrase. A finished component enters the first version. COMPONENT_SET nph-hover-card (4406:1105), opening x arrow x side, 10 variants."
  }
}
```

# DSA-68 — `figma-docs-accepted`

The documentation of `nph-hover-card` (frame `4422:2418`) was accepted in Figma on 2026-11-06, in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit approved. The hover card enters the first version of Nephos. The piece needed 23 `hover-card/*` tokens, put on `v/5.0.0` together with this task, plus:

- one new semantic token: `color/subtle-foreground` (light `core/neutral/500` #737373, dark `core/neutral/300` #ababab), the third level of text, one step below `color/muted-foreground`. It measures 4.74:1 over `color/popover` in light and 5.55:1 in dark;
- one new core value: `core/duration/delay-long` (600 ms), the long wait before the preview opens. Value first in core (T9).

Eight `hover-card/*` tokens point straight to core, by decision, the same paths as `popover/*`: `hover-card/radius` (`core/radius/600`, 14), because `radius/container` resolves to 8, and `radius/surface` resolves to 14 but belongs to cards, panels and sheets, not to floating layers; `hover-card/offset` (`core/space/100`, 4), because `space/inline-tight` and `space/stack-tight` resolve to 4 but join an icon to its text or a label to its text; `hover-card/arrow-width` and `hover-card/arrow-inset` (`core/space/400`, 16) and `hover-card/arrow-height` (`core/space/200`, 8), because the semantic tokens of 16 and 8 are inner margins and gaps between items, and the arrow is the shape of the piece; `hover-card/width` (`core/layout-width/popover-md`, 320), the width of the floating layer family, because the other 320 values are named after the field, the rich option and the dialog; `hover-card/open-delay` (`core/duration/delay-long`, 600), because `motion/hover-delay` (300) is the wait of a help layer such as the tooltip; `hover-card/close-delay` (`core/duration/delay`, 300), because `motion/hover-delay` is a wait before opening and no semantic token waits before closing. Every other `hover-card/*` token is an alias of a semantic token.

There is no command output. The acceptance is a human observation, recorded in the json block above with the frame URL and the component set.

The rest of this file is the contract converted to text, so that whoever codes does not need to open Figma. Figma property and value names stay as they are in Figma (`abertura`, `seta`, `lado`, `texto do gatilho`, `título`, `descrição`, `meta`, `mostrar meta`, `ícone da meta`); the code API is in English. Figma sample texts are translated here.

## Purpose

A read-only preview anchored to a link. It opens when the pointer rests on the link or when the link takes keyboard focus, and it sums up the destination with a title, a description and a meta line, without taking the person away from the page. It varies by opening, arrow and side.

Use it next to a link that leads to a profile, a page or an item: the card shows the essentials before the click. Everything the card shows also exists at the destination. It does not replace nph-tooltip (short text about an element), nph-popover (opens on click and accepts actions) nor a modal dialog.

## Tokens

| Token | Points to | Part |
|---|---|---|
| `hover-card/background` | `color/popover` | Card and arrow fill |
| `hover-card/foreground` | `color/popover-foreground` | Title |
| `hover-card/description-foreground` | `color/muted-foreground` | Description |
| `hover-card/meta-foreground` | `color/subtle-foreground` | Meta text |
| `hover-card/meta-icon-foreground` | `color/subtle-foreground` | Meta icon |
| `hover-card/border` | `color/border-subtle` | Card border and arrow outline |
| `hover-card/border-width` | `border/width` (1) | Border and arrow outline |
| `hover-card/radius` | `core/radius/600` (14) | Card corners |
| `hover-card/padding` | `space/container-padding` (16) | Card inner margin |
| `hover-card/gap` | `space/stack-snug` (8) | Between title, description and meta |
| `hover-card/meta-gap` | `space/inline-tight` (4) | Meta icon to meta text |
| `hover-card/icon-size` | `icon/size-sm` (16) | Meta icon box |
| `hover-card/width` | `core/layout-width/popover-md` (320) | Card width |
| `hover-card/offset` | `core/space/100` (4) | Link to card, or link to arrow tip |
| `hover-card/arrow-width` | `core/space/400` (16) | Arrow base |
| `hover-card/arrow-height` | `core/space/200` (8) | Arrow height |
| `hover-card/arrow-inset` | `core/space/400` (16) | Arrow inset from the card edge |
| `hover-card/focus-border` | `focus/border` | Focus border of the link, 1 px |
| `hover-card/focus-halo` | `focus/halo` | Focus halo of the link, 4 px |
| `hover-card/open-delay` | `core/duration/delay-long` (600 ms) | Pointer rest before opening |
| `hover-card/close-delay` | `core/duration/delay` (300 ms) | Wait before closing |
| `hover-card/enter-duration` | `motion/enter-duration` | Card entry |
| `hover-card/exit-duration` | `motion/exit-duration` | Card exit |

The shadow is the `elevation/dropdown` style, with no component token: diffuse in light, none in dark. Typography: title `text/label-lg`, description `text/body-sm`, meta `text/caption`, link `text/label-md` in `color/primary`, with the corners of its focus ring in `radius/inner`. The focus ring of the link follows the nph-button pattern: thickness `focus/ring-width`, radius `focus/border-radius-inner` and `focus/radius-inner-with-border`.

## Anatomy

1. **Trigger** — a text link in `color/primary`, underlined, `text/label-md`. With focus, it shows the 1 px border `hover-card/focus-border` and, outside it, the 4 px halo `hover-card/focus-halo`.
2. **Arrow** — optional (`seta=com`). 16 x 8 (`hover-card/arrow-width` and `hover-card/arrow-height`), 16 from the card corner (`hover-card/arrow-inset`); it overlaps the card by 1 px and uses the same fill and border.
3. **Card** — fill `hover-card/background`, a 1 px border in `hover-card/border` (#f1f1f1 in light; white at 10% in dark), corners of 14 (`hover-card/radius`) and the `elevation/dropdown` shadow, which is gone in dark. Inner margin 16 (`hover-card/padding`), 8 between title, description and meta (`hover-card/gap`), width 320 (`hover-card/width`).
4. **Title** — short name of the destination, `text/label-lg`, `hover-card/foreground`.
5. **Description** — summary of the destination, `text/body-sm`, `hover-card/description-foreground`; the text wraps, with no scrolling.
6. **Meta line** — optional (`mostrar meta`). An nph-icon at `hover-card/icon-size` and a `text/caption` text, 4 apart (`hover-card/meta-gap`). One step softer than the description: `hover-card/meta-foreground` and `hover-card/meta-icon-foreground`.

In Figma the border, the arrow outline and the meta line each have one layer per theme; both layers use the same token, so the code needs only one.

## Properties

| Figma property | Rule |
|---|---|
| `abertura` (opening) | `ponteiro` (pointer, default) or `foco` (focus). The card opens when the pointer rests on the link or when the link takes keyboard focus; the content is the same. With focus, the link shows the focus border and halo. |
| `seta` (arrow) | `sem` (without, default) or `com` (with). With the arrow, the tip points to the link. |
| `lado` (side) | `baixo` (bottom, default), `cima` (top), `esquerda` (left) or `direita` (right). Where the card opens relative to the link. In the set, the side varies only with the arrow; without it, the card opens below. |
| `texto do gatilho` | Text of the link that opens the card. |
| `título` | Short name of the destination. |
| `descrição` | Summary of the destination, in one or two short sentences. |
| `meta` | Short text of the meta line: a phrase ("Updated today", the default), a date ("November 4, 2026") or a time ("14:30"). |
| `mostrar meta` | Turns the meta line on (default) or off. Off, the card keeps only title and description. |
| `ícone da meta` | Swaps the meta icon. Preferred: `clock` (default), for a phrase or a time, and `calendar`, for a date, both in the light style. |

Not properties:
- **Width**: one width only, 320, in every variant.
- **Image, avatar and badge**: the set has no slot for them. The profile, summary and item examples show those compositions with nph-avatar, nph-image and nph-badge.
- **Color, border and shadow**: they come from `hover-card/background`, `hover-card/border` and the `elevation/dropdown` style, and change with the theme.

## Behavior

- The pointer resting on the link opens the card after 600 ms (`hover-card/open-delay`); the card closes 300 ms after the pointer leaves the link and the card (`hover-card/close-delay`). Keyboard focus opens it with no wait.
- Esc closes the card. The card takes no focus and has no interactive content.
- On touch there is no hover: tapping the link follows it to the destination.
- The preview can be turned off, and everything the card shows also exists at the destination.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | Title, description and meta pass 4.5:1 over `color/popover` in both themes. The meta is one step softer than the description, never below that floor. The card border is decorative; in light, the shadow also sets the card apart from the background. |
| Visible focus | With focus, the link shows the 1 px border `hover-card/focus-border`, which passes 3:1, and the 4 px halo outside it, which is decoration. Focus opens the same card as the pointer. The card is read only and has no focus state. |
| Color is not the only signal | The link is underlined besides its color. The meta stands apart by its icon and its place at the end of the card, not only by its shade of gray. |
| Touch target | The link is a text link 20 tall. It meets the minimum target of WCAG 2.5.8 by the spacing exception, with no other target closer than 24, or, inside a sentence, by the inline link exception. The card has no target. On touch there is no pointer: the content of the card must exist at the destination. |
| Accessible name | The name read comes from the link text. The meta icon and the arrow are decorative (`aria-hidden`). Since the card repeats the destination, a screen reader user reaches the same content through the link. |

## Relations and context

It combines with nph-icon in the meta line and, in the examples, with nph-avatar, nph-image and nph-badge, all by instance; each piece controls its own color. The trigger is a text link drawn in each variant: it shows its own focus, and the card appears only next to it.

| Space | Token |
|---|---|
| Link to card, without the arrow | 4 (`hover-card/offset`), the same distance with and without the arrow |
| Link to arrow tip | 4 (`hover-card/offset`). The arrow is 16 x 8 and overlaps the card by 1 px, so the card sits 11 from the link |
| Inner margin | 16 (`hover-card/padding`) |
| Between title, description and meta | 8 (`hover-card/gap`) |
| Meta icon to meta text | 4 (`hover-card/meta-gap`) |

## When to use

Use it when the link is the main path and a preview helps decide whether to open it: a profile, a page, an item. No arrow is the default; use the arrow when several links sit close together or the card lands far from the link. Prefer opening below; use another side only when space runs out. Use the meta line for a time or context detail; turn it off when it does not help the decision. Time is relative up to 30 days ("Updated today", "3 days ago"), then the full date; a time as "14:30"; the full date always in `title`.

## Required examples

Three use cases, in light and dark:

1. Profile: avatar, name, role and start date.
2. Link summary with an image and a date.
3. Item with a status and a time.

## Do

- Keep the card read only, with no button, link or field — whoever needs to act opens the destination, and the card goes away when the pointer leaves.
- Repeat at the destination everything the card shows — on touch and with a screen reader, the way to the content is the link.
- Limit the card to a title, a short description and one meta line — long text covers the page and tires the reader.
- Choose the meta icon by the kind of text: clock for a phrase or a time, calendar for a date — the icon confirms what the text says.
- Open it also on keyboard focus — whoever does not use a mouse sees the same preview.

## Do not

- Do not put a button, link or field in the card — use nph-popover, which opens on click and accepts actions.
- Do not use it for a short text about an element — use nph-tooltip.
- Do not leave in the card information that is not at the destination — put it on the destination page too.
- Do not write a long description — one or two short sentences; the detail stays at the destination.

## Appendix points answered

1. Accessible alternative for touch and keyboard: focus opens the card; on touch, the link goes to the destination; everything in the card exists at the destination; Esc closes; the preview can be turned off.
2. Actions inside the card: no, read only; actions belong to nph-popover.
3. Delays: open after 600 ms (`hover-card/open-delay`, new `core/duration/delay-long`), close after 300 ms (`hover-card/close-delay`, `core/duration/delay`).
4. Arrow and offset: the popover values; 4 from the link with and without the arrow; arrow 16 x 8, inset 16, straight to core; there is no arrow-offset token.
5. Scope: the hover card enters the first version now.
6. Width: one width, 320, `hover-card/width` straight to `core/layout-width/popover-md`.
7. Remote loading: out of the first version; reopen it with real remote content, weighing nph-spinner before nph-skeleton.
8. Tokens: the ones above, as aliases; the shadow stays in the `elevation/dropdown` style.
9. Link contrast in dark, only in the Gerencial brand (2.71:1; 5.37:1 in light and 6.81:1 in dark in the default brand): the fix belongs to `color/primary` of that brand; the underline stays. This task does not change it.
10. Focus and target: the card takes no focus; the ring stays only on the link. The link meets WCAG 2.5.8 by the spacing exception or, inside a sentence, by the inline link exception.
11. Profile, summary with an image and item with a status: only as examples, with nph-avatar, nph-image and nph-badge by instance, with no slot in the set.
12. Link focus: `hover-card/focus-border` and `hover-card/focus-halo`, as nph-button.
13. 8 between description and meta too: `hover-card/gap` on `space/stack-snug` for both joins.
14. Meta color: `color/subtle-foreground`, the new semantic token.
15. Border: `color/border-subtle`, decided with nph-popover; one token for both themes.
16. Phrase, date or time: relative up to 30 days, then the full date; time as "14:30"; the full date always in `title`.
17. Updated icon: `clock` (light) until `clock-rotate-left` enters nph-icon.
18. Radius: 14, `hover-card/radius` straight to `core/radius/600`, the same as `popover/radius`.
