```json
{
  "task": "DSA-26",
  "gate": "figma-docs-accepted",
  "date": "2026-10-08",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1578-38",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-skeleton frame (1578:38), on the page `NPH — Skeleton`, was accepted as the API and behavior specification of the nph-skeleton. COMPONENT_SET: nph-skeleton (1578:37), properties `forma`."
  }
}
```

# DSA-26 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-skeleton` frame (`1578:38`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Skeleton`. Indiane accepted the visual and the documentation on 08-10-2026; the Figma UX QA (round 2) and the textual audit (round 2) were approved on 08-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A still shape that holds the place of a content while it loads.

## Description
Use it when the screen already knows the shape of the content that will come in, such as text, image or person, and it is still loading. The piece stays still, with no pulse. It does not replace `nph-spinner`, which shows a wait with no known shape, nor `nph-empty`, which says there is no content.

## Anatomy

| Part | Rule |
|---|---|
| Shape | A rectangle in `color/muted`, with no border, no text and no animation. |
| Radius | `radius/inner` on the line, `radius/control` on the block and `avatar/radius-*` on the avatar, with rounded corners, never a circle. |
| Measure | The avatar in `avatar/size-*`; the line height in `skeleton/line-height`. The width of the line and the block comes from the container, and the block height follows the content that will come in. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The shape carries no information: the contrast with the background is low on purpose and does not need to reach 3:1. The loading information comes from the container. |
| Visible focus | The piece does not receive focus. |
| Color is not the only signal | The wait is announced by the container, not by the color of the shape. |
| Touch target | It is not interactive and has no touch target. |
| Accessible name | The shape gets `aria-hidden`; the loading container gets `aria-busy` while it waits. |
| Motion | The piece is still: there is no pulse to reduce when the person prefers less motion. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `forma` | `linha` \| `bloco` \| `avatar sm` \| `avatar md` \| `avatar lg`, default `linha`. `linha`: the place of a text line. `bloco`: the place of an image, chart or area. `avatar sm`, `md` or `lg`: the place of an `nph-avatar` of the same size. |
| Width and height | Not properties: the line and the block stretch to the container width, and the block height follows the content that will come in. The measure of the set is only the sample's. |
| Animation | Does not exist: the piece is still. |
| Color | Not a property: the shape always uses `color/muted`. |

## Relations and context
- It builds the place of other pieces: avatar and lines in place of a person, lines in place of a paragraph, a block in place of an image.
- The avatar shape uses `avatar/size-*` and `avatar/radius-*`, like `nph-avatar`.
- Between shapes, the space is the same as the content that will come in.
- When the content arrives, it enters the exact place of the shape.

## When to use
- When the shape of the content is known and it is still loading.
- Choose the shape equal to the content: line for text, block for an image or area, avatar for a person.
- When the shape is not known, use `nph-spinner`.
- When there is no content, use `nph-empty`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| List of people loading | An `sm` avatar and two lines per person. |
| Card loading | A block in place of the image and lines in place of the text. |
| Paragraph loading | One line per text line. |

## Do
- Repeat the shape of the final content, because the swap must not move the layout.
- Use the avatar shape in the size of the `nph-avatar` that will come in, because the size stays the same.
- Announce the wait on the container, because the shape is not read.
- Keep the piece still, because it has no pulse.

## Do not
- Do not use it as an empty state: use `nph-empty`.
- Do not use it when the shape of the content is not known: use `nph-spinner`.
- Do not use one avatar size in place of another: use the avatar shape of the same size.

## Source of the acceptance
WORK BRAIN — `2026-10-08.md`: Figma UX QA approved in round 2, acceptance of the visual and the documentation, textual audit approved in round 2.
