```json
{
  "task": "DSA-24",
  "gate": "figma-docs-accepted",
  "date": "2026-10-06",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1434-30",
    "date": "2026-10-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar frame (1434:30), on the page `NPH — Avatar`, was accepted as the API and behavior specification of the nph-avatar. COMPONENT_SET: nph-avatar (1434:29), properties `size` and `tipo`."
  }
}
```

# DSA-24 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-avatar` frame (`1434:30`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Avatar`. The visual, the Figma UX QA with an approved independent review and the documentation were accepted, and the textual audit was approved in round 2 on 06-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
Shows who the person is, by the photo or, without a photo, by the person icon.

## Description
Use it next to a person's name, so the person is recognized faster. It is not a button or an icon: it opens nothing by itself and does not stand for an action. It does not replace the written name.

## Anatomy

| Part | Rule |
|---|---|
| Frame | A square with rounded corners, background `color/muted` and border `color/border`. |
| Photo | The person's image, which fills the frame. |
| Person icon | Shows when there is no photo, in `color/muted-foreground`. |

Tokens on `v/5.0.0`: `avatar/size-sm`, `avatar/size-md`, `avatar/size-lg` (24, 32 and 40) and `avatar/radius-sm`, `avatar/radius-md`, `avatar/radius-lg`.

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The person icon passes 3:1 on the background, in light and dark. |
| Visible focus | Not applicable: the avatar does not receive focus. Inside a control, the focus belongs to the control. |
| Color is not the only signal | The avatar does not communicate state. |
| Touch target | Not applicable: the avatar is not interactive. The target is the one of the control that contains it. |
| Accessible name | With the name next to it, the avatar is hidden from the screen reader (`aria-hidden`). Alone, it announces the person's name. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `sm` \| `md` \| `lg`, default `sm`. `sm` in a list, select and body text line; `md` in a header, card and table row; `lg` in a profile and person highlight. |
| `tipo` | `foto` \| `sem foto`, default `foto`. `foto` when the person has an image; `sem foto` shows the person icon. |
| Shape | Not a property. Always a square with rounded corners, never a circle. |
| State | No hover, focus or disabled of its own. |

## Relations and context
- In `nph-select`, the avatar enters at the start of the trigger and of the option, in size `sm`.
- The person's name sits next to it, with the `space/inline` space.

## When to use
- When the person needs to recognize someone in a list, a field or a header.
- `sm` next to body text; `md` in a header and card; `lg` in a profile.
- `sem foto` whenever the image does not exist or does not load.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Owner select | The avatar in the select. |
| Card header | The avatar with the name. |
| Profile without photo | `sem foto`. |

## Do
- Put the person's name next to it: the avatar alone does not identify anyone with certainty.
- Use `sem foto` when there is no image, instead of leaving the frame empty.
- Use the same size for every avatar in a list.

## Do not
- Do not use it as a button: the avatar receives no click and no focus.
- Do not use it as an action icon: use `nph-icon`.
- Do not make it a circle: the avatar is a square with rounded corners.
- Do not leave the frame empty: use `sem foto`.

## Source of the acceptance
WORK BRAIN — `2026-10-06.md`: Figma flow closed for `nph-avatar` (visual acceptance, Figma UX QA, documentation approved by Indiane, textual audit approved).
