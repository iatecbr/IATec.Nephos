---
piece: nph-skeleton
level: component
status: active
solves: >-
  Holds the place of a content whose shape is known while it loads, with a still
  shape that does not move the layout when the content arrives.
use_when:
  - "When the shape of the content is known and it is still loading."
  - "Choose the shape equal to the content: line for text, block for an image or area, avatar for a person."
  - "Repeat the shape of the final content, because the swap must not move the layout."
  - "Use the avatar shape in the size of the nph-avatar that will come in, because the size stays the same."
  - "Announce the wait on the container, because the shape is not read."
  - "Keep the piece still, because it has no pulse."
do_not_use_when:
  - "When the shape of the content is not known: use nph-spinner."
  - "When there is no content, or as an empty state: use nph-empty."
  - "One avatar size in place of another: use the avatar shape of the same size."
api:
  shape:
    type: enum
    values: [line, block, avatar-sm, avatar-md, avatar-lg]
    required: false
    default: line
    reflects: true
    constraint: >-
      Reflects because the internal CSS selects the box by it. It is the Figma
      property forma. A value outside the list draws nothing and emits
      console.error in development.
variants:
  shape:
    axis: appearance
    choose_when: "line for text, block for an image, chart or area, avatar-sm, avatar-md or avatar-lg for an nph-avatar of the same size."
    do_not_combine_with: [text, animation, color]
states:
  default:
    token: color/muted
    changes_for_user: "A still rectangle holds the place of the content; it does not change with interaction."
business_rules:
  - "The shape always uses color/muted, with no border, no text and no animation: it carries no state."
  - "The line takes its own skeleton/line-height; the space between lines comes from whoever uses it."
  - "The line and the block stretch to the container width. The block height follows the content that will come in, so whoever uses it gives the height."
  - "The avatar takes avatar/size-* and avatar/radius-*, like nph-avatar, with rounded corners and never a circle."
  - "The wait is announced by the container with aria-busy, not by the piece."
domain_errors: []
tokens:
  color: color/muted
  line_height: skeleton/line-height
  line_radius: radius/inner
  block_radius: radius/control
  avatar_size: "avatar/size-sm, avatar/size-md, avatar/size-lg"
  avatar_radius: "avatar/radius-sm, avatar/radius-md, avatar/radius-lg"
ai_hints:
  - "Use nph-skeleton when the shape of the content is known and it is loading; when the shape is not known, use nph-spinner."
  - "Use nph-skeleton for the place of content that will come in; when there is no content, use nph-empty."
  - "Choose the shape equal to the content: line for text, block for an image or area, avatar-sm, avatar-md or avatar-lg for a person in the size of the nph-avatar that will come in."
  - "Put aria-busy on the loading container, because nph-skeleton is decorative and is not read."
accessibility:
  semantics: "The host is `aria-hidden`: the shape is decorative and stays out of the accessibility tree. The loading container gets `aria-busy` while it waits."
  accessible_name: not_applicable
  keyboard: []
  focus: "The piece does not receive focus."
  contrast: "The shape carries no information: the contrast with the background is low on purpose and does not need to reach 3:1."
  color_alternative: "The wait is announced by the container, not by the color of the shape. The piece is still, so there is no pulse to reduce under reduced motion."
invalid_combinations:
  - "One avatar size in place of another — the size would change when the content arrives."
  - "Text inside the shape — the shape holds no text."
  - "Another color or an animation — the shape always uses color/muted and is still."
relations:
  combines_with: [nph-avatar, nph-spinner]
  parents: [list, card, paragraph]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the skeleton as an empty state."
  - "Using the skeleton when the shape of the content is not known."
  - "Using one avatar size in place of another."
  - "Animating the shape or painting it with another color."
sources:
  design_md: "design.md, color/muted, skeleton/line-height, radius/inner, radius/control, avatar/size-* and avatar/radius-*"
  decision: "P69 — API and semantics of nph-skeleton, 15-10-2026"
  tests: "src/components/nph-skeleton/nph-skeleton.test.ts"
  usage_evidence: "none in code yet; the accepted frame shows a list of people, a card and a paragraph loading"
  storybook: "src/components/nph-skeleton/nph-skeleton.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-skeleton frame 1578:38 and set 1578:37"
---

# nph-skeleton

## Function

**The problem it solves:** holds the place of a content whose shape is known while it
loads. The piece stays still, with no pulse, and the content enters the exact place of
the shape, so the swap does not move the layout.

**When to use:**

- When the shape of the content is known and it is still loading.
- Choose the shape equal to the content: line for text, block for an image or area,
  avatar for a person.
- Repeat the shape of the final content, because the swap must not move the layout.
- Use the avatar shape in the size of the `nph-avatar` that will come in, because the
  size stays the same.
- Announce the wait on the container, because the shape is not read.
- Keep the piece still, because it has no pulse.

**When NOT to use:**

- **When the shape of the content is not known** — use `nph-spinner`.
- **When there is no content, or as an empty state** — use `nph-empty`.
- **One avatar size in place of another** — use the avatar shape of the same size.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `shape` | `line` (default), `block`, `avatar-sm`, `avatar-md`, `avatar-lg` | `line` for text; `block` for an image, chart or area; `avatar-*` for an `nph-avatar` of the same size |

`shape` is the Figma property `forma`.

**By size and density:** `not_applicable`. The three avatar sizes are shapes of the same
property, not a second axis.

**Do not combine with:** text, an animation or another color.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/muted` | A still rectangle holds the place of the content; it does not change with interaction |

**Feedback and focus:** the piece does not receive focus nor react to interaction. It is
still: there is no pulse, so there is nothing to reduce under reduced motion.

**Business rule the piece carries:**

- The shape always uses `color/muted`, with no border, no text and no animation.
- The line takes its own `skeleton/line-height`; the space between lines comes from
  whoever uses it.
- The line and the block stretch to the container width. The block height follows the
  content that will come in, so whoever uses it gives the height.
- The avatar takes `avatar/size-*` and `avatar/radius-*`, like `nph-avatar`, with
  rounded corners and never a circle.
- The wait is announced by the container with `aria-busy`, not by the piece.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is `aria-hidden`: the shape is decorative. The loading container gets `aria-busy` while it waits |
| Accessible name | `not_applicable` |
| Keyboard and focus | The piece does not receive focus |
| Contrast | The shape carries no information: the contrast with the background is low on purpose and does not need to reach 3:1 |
| Alternative to color | The wait is announced by the container, not by the color of the shape |
| Touch target | It is not interactive and has no touch target |
| Motion | The piece is still: there is no pulse to reduce under reduced motion |

## Relations

**Combines with:** `nph-avatar`, whose place the avatar shape holds in the same size, and
`nph-spinner`, which shows a wait with no known shape.

**What is the parent:** a list of people, a card or a paragraph that is loading. The
container carries `aria-busy`.

**What is the child:** nothing.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Color | `color/muted` |
| Line height | `skeleton/line-height` |
| Line radius | `radius/inner` |
| Block radius | `radius/control` |
| Avatar size | `avatar/size-sm`, `avatar/size-md`, `avatar/size-lg` |
| Avatar radius | `avatar/radius-sm`, `avatar/radius-md`, `avatar/radius-lg` |

**Usage restrictions:** the width of the line and the block comes from the container, and
the block height follows the content that will come in. No token gives either one.

**AI hints:**

- Use `nph-skeleton` when the shape of the content is known and it is loading; when the
  shape is not known, use `nph-spinner`.
- Use `nph-skeleton` for the place of content that will come in; when there is no
  content, use `nph-empty`.
- Choose the shape equal to the content: `line` for text, `block` for an image or area,
  `avatar-sm`, `avatar-md` or `avatar-lg` for a person in the size of the `nph-avatar`
  that will come in.
- Put `aria-busy` on the loading container, because `nph-skeleton` is decorative and is
  not read.

## Examples

**Recommended case:** a list of people loading, with an `avatar-sm` and two lines per
person, inside a container with `aria-busy="true"`.

**Alternative case:** a card loading, with a `block` in place of the image and lines in
place of the text. A paragraph loading takes one line per text line.

## Anti-patterns

- **Do not use as an empty state** — use `nph-empty`.
- **Do not use when the shape of the content is not known** — use `nph-spinner`.
- **Do not use one avatar size in place of another** — use the avatar shape of the same
  size.
- **Do not animate the shape or paint it with another color** — it always uses
  `color/muted` and is still.

## Sources and decisions

- **The repository `design.md`:** `color/muted`, `skeleton/line-height`, `radius/inner`,
  `radius/control`, `avatar/size-*` and `avatar/radius-*`.
- **The decision that originated it:** P69, of 15-10-2026.
- **Tests:** `src/components/nph-skeleton/nph-skeleton.test.ts`.
- **Usage evidence:** none in code yet. The accepted frame shows a list of people, a card
  and a paragraph loading.
- **Storybook:** `src/components/nph-skeleton/nph-skeleton.stories.ts`.
- **Figma:** `nph-skeleton` frame (`1578:38`) and set `1578:37` in `DS-IA-NEPHOS 5.0`.
