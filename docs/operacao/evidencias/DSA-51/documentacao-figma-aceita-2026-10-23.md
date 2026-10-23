```json
{
  "task": "DSA-51",
  "gate": "figma-docs-accepted",
  "date": "2026-10-23",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2573-66090",
    "date": "2026-10-23",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-image board (2573:66090), with its `Documentação` frame (2677:465), was accepted as the API and behavior specification of the nph-image. COMPONENT_SET: nph-image (2573:66089), variants `tamanho` (xs, sm, md, lg, xl, 2xl, mídia), `proporção` (1:1, 4:3, 16:9), `estado` (carregada, carregando, vazio, erro, hover, foco, desabilitada) and `giro` (0, 1, 2)."
  }
}
```

# DSA-51 — `figma-docs-accepted`

The documentation of the `nph-image` board (`2573:66090`) was accepted in Figma,
in the file `DS-IA-NEPHOS 5.0`, with the Figma UX QA and the textual audit
approved. The component needed 33 tokens that were not on `v/5.0.0`: 23 semantic
`image/*` tokens, the semantic `overlay/on-media-strong` and
`overlay/on-media-foreground`, and the core primitives `core/image-size/100` to
`600`, `core/layout-width/media` and `core/alpha/black-60`. They were taken to
`v/5.0.0` with the same values as in Figma, together with this task. Every other
token it uses was already there.

There is no command output. The acceptance is a human observation, recorded with
the date, the authorship, the board URL and the component.

The rest of this file is the Figma documentation converted to text, so that
whoever codes does not need to open Figma. Figma property names stay as they are
in Figma (Portuguese); the code API is in English (P64).

## Purpose

Shows the image of a product, file or content in a fixed area, with loading, empty
and error states.

Selection: `nph-image` — properties `tamanho`, `proporção`, `estado` and `giro`.

## Description

Use it when the screen shows the image of a product, file or content, in an area
of the same size with or without the image. It is not an avatar and not an icon:
for a person use the `nph-avatar`; for a symbol, the `nph-icon`.

## Anatomy

| Part | Rule |
|---|---|
| 1. Frame | Area with rounded corners (`image/radius-sm`, `image/radius-md` or `image/radius-lg`, by size), background `image/background` and border `image/border` in `image/border-width`. The loading state has no border. It keeps the same area even without the image. |
| 2. Image | The content image; it fills the frame. |
| 3. Spinner | Open arc in `image/foreground` that rotates while the image loads. |
| 4. Empty and error illustration | Gray line drawing shown without an image or when it fails. There is one version for each color scheme, switched by `image/illustration-light` and `image/illustration-dark`. |
| 5. Veil and hover icon | Veil `image/overlay` with an eye icon in `image/on-overlay`, only in the `hover` state. The eye is an `nph-icon`, sized by `image/icon-size-sm`, `image/icon-size-md` or `image/icon-size-lg`. |
| 6. Focus ring | Outline `image/focus-border` with the width of `focus/ring-width`, only in the `foco` state. |

## Accessibility

| Criterion | Rule |
|---|---|
| Contrast | The spinner uses `image/foreground` over `image/background` and passes 3:1, in light and dark. The focus ring uses `image/focus-border` and also passes 3:1. |
| Visible focus | In the `foco` state, the ring uses `image/focus-border` with `focus/ring-width`. The image only receives focus when it is clickable; otherwise the focus belongs to the control that contains it. |
| Color is not the only signal | Loading, empty and error change the drawing (spinner or illustration), not only the color. The text that explains the problem belongs to the parent. |
| Touch target | Does not apply to the image alone. If it is clickable, the target is the one of the control that contains it. |
| Accessible name | The name read comes from the `alt`, which describes the content. With an empty `alt`, the image is hidden from the screen reader (`aria-hidden`). |

Demonstration in Figma: with `alt` (the reader reads the description), empty `alt`
(the text next to it already says it all) and focus (ring `image/focus-border`).

## Properties, variants and states

| Field | Rule |
|---|---|
| `tamanho` | `sm`, `md`, `lg`, `xl` and `2xl` are square, from the smallest to the largest. `mídia` uses the content width (`image/media-width`) and accepts the proportions. `xs` also exists in the set (default value of the property); the documentation gives no usage rule for it. |
| `proporção` | `1:1`, `4:3` and `16:9`. Only valid in `mídia`; the other sizes are always `1:1`. |
| `estado` | `carregada` shows the image. `carregando` shows the spinner. `vazio` is without an image. `erro` is the image that did not load. `hover`, `foco` and `desabilitada` mark the interaction. |
| `giro` | Only in `carregando`: step of the spinner rotation. The prototype changes the step by itself; it is not chosen by hand. |
| Illustration | Not a property. Empty and error swap the illustration by color scheme, with `image/illustration-light` and `image/illustration-dark`. |
| Image | Not a property. The content goes in the fill of the photo layer; without it, use the empty state. |

### Measures read from the set

| `tamanho` | Size token | Size | Radius token | Radius |
|---|---|---|---|---|
| `xs` | `image/size-xs` | 24 | `image/radius-sm` | 4 |
| `sm` | `image/size-sm` | 32 | `image/radius-sm` | 4 |
| `md` | `image/size-md` | 48 | `image/radius-md` | 6 |
| `lg` | `image/size-lg` | 64 | `image/radius-md` | 6 |
| `xl` | `image/size-xl` | 96 | `image/radius-lg` | 8 |
| `2xl` | `image/size-2xl` | 128 | `image/radius-lg` | 8 |
| `mídia` | `image/media-width` | width 256; height 256 (`1:1`), 192 (`4:3`) or 144 (`16:9`) | `image/radius-lg` | 8 |

Every variant uses `image/background` as fill and a 1 px border (`image/border-width`)
in `image/border`; `carregando` has no border and `foco` uses `image/focus-border`.

## Relations and context

- Next to text, the space is `image/gap` (`space/inline`). In a table, list, card or
  gallery, the container defines the position and the image keeps its own area.
- Hover, focus and disabled are applied by the parent when the image is clickable.
  The color comes from the `image/*` variables; the ring width comes from
  `focus/ring-width` and the disabled opacity from `state/disabled-opacity`.
- The hover eye icon is an `nph-icon`.

Demonstration in Figma: next to text (space `image/gap`), hover (veil and eye icon)
and disabled (reduced opacity).

## When to use

- When the screen shows the image of a product, file or content in an area of fixed size.
- Choose the size by the place: `sm` in the table, `md` in the list, `lg` in the
  product item and in the upload, `xl` and `2xl` in the side card and in the image
  template, `mídia` in the card, in the gallery and in the cover.
- Choose the state by what happens: loading while the image has not arrived, empty
  when there is no image, error when it failed.
- In `mídia`, choose `1:1`, `4:3` or `16:9` by the fit of the card, gallery or cover.

## Required examples

Three examples, each in light and dark: list item (`md` with the name next to it),
card cover (`mídia`, `16:9`) and upload still without an image (`vazio`).

## Do

- Write an `alt` that describes the content — whoever uses a screen reader understands the image.
- Use an empty `alt` when the text next to it already says it all — the reader does not repeat the information.
- Show empty when there is no image and error when it fails — the area is not left blank and the person understands what happened.
- Use a single size per list — the rows stay aligned.

## Do not

- Do not use it for a person — use the `nph-avatar`.
- Do not leave loading without an end — if the image does not come, show error.
- Do not mix sizes in the same list — choose a single size.
- Do not use it as an icon or a button — for a symbol use the `nph-icon`; for an action, the `nph-button`.

## Tokens of the component

Semantic tokens added to `v/5.0.0` with this task (light and dark resolve to the same
value unless noted):

| Token | Value |
|---|---|
| `image/size-xs` to `image/size-2xl` | `core/image-size/100` to `600` (24, 32, 48, 64, 96, 128) |
| `image/radius-sm` | `radius/inner` |
| `image/radius-md` | `core/radius/300` (6) |
| `image/radius-lg` | `core/radius/400` (8) |
| `image/background` | `color/muted` |
| `image/foreground` | `color/muted-foreground` |
| `image/border` | `color/border` |
| `image/border-width` | `border/width` |
| `image/focus-border` | `focus/border` |
| `image/overlay` | `overlay/on-media-strong` (`core/alpha/black-60`) |
| `image/on-overlay` | `overlay/on-media-foreground` (`core/base/white`) |
| `image/gap` | `space/inline` |
| `image/media-width` | `core/layout-width/media` (256) |
| `image/icon-size-sm`, `-md`, `-lg` | `icon/size-sm`, `icon/size-md`, `icon/size-lg` |
| `image/illustration-light` | 1 in light, 0 in dark |
| `image/illustration-dark` | 0 in light, 1 in dark |

The two illustration tokens are booleans in Figma and numbers 1 and 0 in the token
sources, as `scheme/is-light` and `scheme/is-dark` already are. The illustrations
themselves (gray line drawings for loading, empty and error, per scheme and per
proportion) are image assets, not tokens; they are not part of this task's token
set, and the code must ask Indiane for the files.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `2573:66090`, `Documentação` frame `2677:465`,
  set `2573:66089`
- `design.md` — the tokens named above
