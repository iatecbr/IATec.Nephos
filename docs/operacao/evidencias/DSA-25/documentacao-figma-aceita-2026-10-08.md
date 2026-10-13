```json
{
  "task": "DSA-25",
  "gate": "figma-docs-accepted",
  "date": "2026-10-08",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1579-46",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar-stack frame (1579:46), on the page `NPH — Avatar Stack`, was accepted as the API and behavior specification of the nph-avatar-stack. COMPONENT_SET: nph-avatar-stack (1579:45), properties `size` and the properties `mostrar 3º`, `mostrar 4º`, `mostrar 5º`, `mostrar contagem` and `contagem`."
  }
}
```

# DSA-25 — `figma-docs-accepted`

Indiane accepted the documentation of the `nph-avatar-stack` frame (`1579:46`) in the
file `DS-IA-NEPHOS 5.0`, page `NPH — Avatar Stack`. Indiane accepted the visual and the documentation on 08-10-2026; the Figma UX QA and the textual audit were approved on 08-10-2026.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the frame URL and the set.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose
A group of overlapping avatars that shows several people in a short space, with the count of who does not show.

## Description
Use it when the screen needs to show who takes part in something, such as owners, members or participants, without listing everyone. Each avatar is an `nph-avatar`, and the overlap comes from the `avatar/overlap` token. When there are more people than avatars, the "+N" count shows how many are missing. It does not replace the list of people with names, nor the single `nph-avatar` next to a name.

## Anatomy

| Part | Rule |
|---|---|
| Avatar | An `nph-avatar` instance, with or without a photo, in the group size. Photo, icon, radius and border come from it. |
| Overlap | The `avatar/overlap` space between neighbors: each avatar goes over the previous one, and the `color/border` border separates them. |
| Count | Background `color/muted`, border `color/border` at `border/width`, radius `avatar/radius-*` and the "+N" text in `color/muted-foreground`. Height and minimum width in `avatar/size-*`, side padding in `space/inline-tight`; it grows with the number. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The "+N" text passes 4.5:1 on the count background in both modes. |
| Visible focus | The piece does not receive focus. When the group opens the list of people, the focus belongs to the control around it. |
| Color is not the only signal | Each person shows by photo or person icon, and the total shows as text. |
| Touch target | It is not interactive and has no touch target. |
| Accessible name | The group is read as a whole, with the names and the total, such as "Ana, Bruno, Carla and 3 more". The avatars and the count get `aria-hidden`. |

## Properties, variants and states

| Figma property | Rule |
|---|---|
| `size` | `sm` \| `md` \| `lg`, default `sm`, the same size as `nph-avatar`: `sm` in a list and select; `md` in a header, card and table; `lg` in a profile. |
| `mostrar 3º`, `mostrar 4º`, `mostrar 5º` | Boolean; defaults on, off, off. Turn on the 3rd to the 5th avatars. The 1st and 2nd are always visible. |
| `mostrar contagem` | Boolean, default off. Turns on the count at the end of the group. |
| `contagem` | Text, default "+3". The count text, always in the "+N" format. |
| Avatar type | Not a property of the group: photo or no photo is switched on each avatar, in the instance. |
| Order | Not a property: each avatar goes over the previous one. |

## Relations and context
- Made of `nph-avatar` instances; photo, icon, radius and border come from it.
- The overlap uses `avatar/overlap`, which does not apply to other pieces.
- Next to a text, such as the team name, the space is `space/inline`.
- The size follows the place, as in `nph-avatar`: `sm` in a list option, `md` in a table row and card, `lg` in a profile.

## When to use
- To show who takes part, without listing everyone.
- Show up to the 5th avatar; whoever does not show enters the count.
- Choose the size by the place: `sm` in a list, `md` in a header, card and table, `lg` in a profile.
- For a single person, use `nph-avatar`.

## Required examples
Each in light and dark mode:

| Example | What it shows |
|---|---|
| Task owners | `md`, three people. |
| Meeting participants | `md`, five avatars and the count. |
| Members in the list | `sm`, three avatars and the count. |

## Do
- Turn on the count when there are more people than avatars, because the total must show.
- Use the same size on every avatar, because the group has a single size.
- Give the group a name with the people and the total, because the avatars are not read.
- Use `sem foto` when there is no image, because the person icon keeps the shape.

## Do not
- Do not space the avatars without overlap: use `nph-avatar-stack`, which already brings `avatar/overlap`.
- Do not mix sizes in the group: use a single size.
- Do not go past the 5th avatar: use the "+N" count for whoever does not show.

## Source of the acceptance
WORK BRAIN — `2026-10-08.md`: Figma UX QA approved, acceptance of the visual and the documentation, textual audit approved.
