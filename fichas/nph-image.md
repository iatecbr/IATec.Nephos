---
piece: nph-image
level: component
status: active
solves: >-
  Shows the image of a product, file or content in an area of fixed size, with the
  loading, empty and error states, so the area stays the same with or without the image.
use_when:
  - "When the screen shows the image of a product, file or content in an area of fixed size."
  - "Choose the size by the place: sm in the table, md in the list, lg in the product item and in the upload, xl and 2xl in the side card and in the image template, media in the card, in the gallery and in the cover."
  - "Choose the state by what happens: loading while the image has not arrived, empty when there is no image, error when it failed."
  - "In media, choose 1:1, 4:3 or 16:9 by the fit of the card, gallery or cover."
  - "Write an alt that describes the content, or leave it empty when the text next to it already says it all."
  - "Use a single size per list, so the rows stay aligned."
do_not_use_when:
  - "For a person: use nph-avatar."
  - "As an icon: for a symbol use nph-icon."
  - "As a button for an action: use nph-button."
  - "With loading that never ends: if the image does not come, show error."
  - "With different sizes in the same list."
api:
  size:
    type: enum
    values: [xs, sm, md, lg, xl, 2xl, media]
    required: false
    default: xs
    reflects: true
    constraint: >-
      The Figma property `tamanho`, with `mídia` as media. The default is xs, as in Figma.
      Reflects because the internal CSS selects the box by it. The square sizes are 24,
      32, 48, 64, 96 and 128 px; media takes the content width, 256 px. A value outside
      the list draws nothing and emits console.error in development.
  ratio:
    type: enum
    values: ["1:1", "4:3", "16:9"]
    required: false
    default: "1:1"
    reflects: true
    constraint: >-
      The Figma property `proporção`. Only media uses it, for a height of 256, 192 or 144
      px; the other sizes are always square and ignore it, with no warning. A value
      outside the list draws nothing and emits console.error in development. The name is
      a technical proposal of P90.
  src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The address of the image. The content states of the Figma `estado` are not a property:
      they derive from src. No src is empty; with src the piece is loading until the image
      loads or fails. Empty or whitespace-only counts as no src, and a new src starts the
      wait again. The read-only status says the state, and the host repeats the native
      load and error of the image, without bubbling.
  alt:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name, the description of the content. With text, the host takes role
      img and aria-label, in every state. Empty or whitespace-only, the host takes
      aria-hidden true. A clickable image gives it to its inner button.
  interactive:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The image is clickable. The piece draws an inner native button that fills the frame,
      takes the focus and carries the alt; the click is the native click. Hover over a
      loaded image shows the veil and the eye, and keyboard focus shows the ring. Without
      alt it renders and emits console.warn in development. The name is a technical
      proposal of P90.
  disabled:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      The whole piece at state/disabled-opacity. With interactive, the inner button is
      natively disabled: out of the Tab order, no click and no veil.
variants:
  size:
    axis: size
    choose_when: "sm in the table, md in the list, lg in the product item and in the upload, xl and 2xl in the side card and in the image template, media in the card, in the gallery and in the cover. xs is in the Figma set with no usage rule of its own."
    do_not_combine_with: []
  ratio:
    axis: size
    choose_when: "Only in media: 1:1, 4:3 or 16:9 by the fit of the card, gallery or cover."
    do_not_combine_with: [xs, sm, md, lg, xl, 2xl]
states:
  empty:
    token: image/background
    changes_for_user: "No src: the frame with its border. Until the illustrations arrive, the frame shows nothing else."
  loading:
    token: image/foreground
    changes_for_user: "The spinner turns at the center and the frame has no border."
  loaded:
    token: image/border
    changes_for_user: "The image fills the frame and crops to keep its proportion; the border stays over it."
  error:
    token: image/background
    changes_for_user: "The image did not load: the frame with its border, as empty, until the illustrations arrive. The parent explains the problem."
  hover:
    token: image/overlay
    changes_for_user: "Only on a clickable, loaded image: the veil with the eye in image/on-overlay."
  focus:
    token: image/focus-border
    changes_for_user: "Only on keyboard focus of a clickable image: the ring in focus/ring-width, just outside the frame and never over the photo."
  disabled:
    token: state/disabled-opacity
    changes_for_user: "The whole piece fades; a clickable one takes no focus and no click."
business_rules:
  - "The area is the same in every state: empty, loading, loaded and error keep the size of the frame."
  - "The content state derives from src and the load; it is not chosen by hand."
  - "Hover, focus and disabled exist only when the parent makes the image clickable with interactive."
  - "Empty and error draw the frame only until their illustrations arrive; the text that explains a failure belongs to the parent."
  - "The ratio only applies to media; every other size is square."
domain_errors: []
tokens:
  size: [image/size-xs, image/size-sm, image/size-md, image/size-lg, image/size-xl, image/size-2xl, image/media-width]
  radius: [image/radius-sm, image/radius-md, image/radius-lg]
  background: image/background
  foreground: image/foreground
  border: [image/border-width, image/border]
  overlay: [image/overlay, image/on-overlay]
  icon_size: [image/icon-size-sm, image/icon-size-md, image/icon-size-lg]
  focus: [image/focus-border, focus/ring-width]
  disabled: state/disabled-opacity
  illustration: [image/illustration-light, image/illustration-dark]
ai_hints:
  - "Use nph-image for the image of a product, file or content; for a person use nph-avatar, for a symbol nph-icon."
  - "Pass src and let the piece show loading, loaded or error by itself; leave src out for empty."
  - "Write an alt that describes the content, or leave it empty when the text next to it says it all."
  - "Choose the size by the place and keep a single size per list; ratio only matters in media."
  - "Set interactive only when the image opens something, such as a preview, and give it an alt; for any other action use nph-button."
  - "Listen to the error event of the host to write the text that explains a failure next to the image."
accessibility:
  semantics: "An image on the host, or nothing. With alt, role img and aria-label on the host; with an empty alt, aria-hidden true. A clickable image is an inner native button named by the alt, and the host has no role. The inner image has an empty alt."
  accessible_name: "The alt, which describes the content. With the text next to the image saying it all, the alt stays empty."
  keyboard: ["Tab moves the focus to a clickable image", "Enter and Space click a clickable image"]
  focus: "Only a clickable image receives focus, through its inner button: the ring image/focus-border in focus/ring-width, with the keyboard. Otherwise the piece has no tabindex and the focus belongs to the control that contains it."
  contrast: "The spinner, image/foreground on image/background, and the focus ring pass 3:1 in light and dark, in every brand; nph-image.test.ts measures them until the accessibility gate of P72 arrives."
  color_alternative: "Loading changes the drawing to the spinner. Empty and error will change it to their illustrations; until those arrive, the parent's text carries the difference."
invalid_combinations:
  - "A size outside xs, sm, md, lg, xl, 2xl and media — the piece draws nothing."
  - "A ratio outside 1:1, 4:3 and 16:9 — the piece draws nothing."
  - "interactive without alt — the button has no name; the piece warns in development."
relations:
  combines_with: [nph-spinner, nph-icon, nph-avatar, nph-button, nph-table]
  parents: ["table", "list", "card", "gallery", "cover", "upload"]
  children: [nph-spinner, nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the image for a person."
  - "Using the image as an icon or as a button for an action."
  - "Leaving loading without an end."
  - "Mixing sizes in the same list."
  - "Leaving the area blank instead of showing empty or error."
sources:
  design_md: "design.md has no entry yet for the image/* tokens, overlay/on-media-strong and overlay/on-media-foreground (pending decision D2); they are in src/tokens/source/semantic.tokens.json"
  decision: "P90 — API and semantics of nph-image, 23-10-2026"
  tests: "src/components/nph-image/nph-image.test.ts"
  usage_evidence: "nph-table (planned) will take it for the thumbnail and the expanded item"
  storybook: "src/components/nph-image/nph-image.stories.ts and nph-image.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-image board 2573:66090, documentation frame 2677:465 and set 2573:66089"
---

# nph-image

## Function

**The problem it solves:** shows the image of a product, file or content in an area of
fixed size, with the loading, empty and error states. The area stays the same with or
without the image, so a list, a table or a gallery keeps its layout. It is not an avatar
and not an icon.

**When to use:**

- When the screen shows the image of a product, file or content in an area of fixed size.
- Choose the size by the place: `sm` in the table, `md` in the list, `lg` in the product
  item and in the upload, `xl` and `2xl` in the side card and in the image template,
  `media` in the card, in the gallery and in the cover.
- Choose the state by what happens: loading while the image has not arrived, empty when
  there is no image, error when it failed.
- In `media`, choose `1:1`, `4:3` or `16:9` by the fit of the card, gallery or cover.
- Write an `alt` that describes the content, or leave it empty when the text next to it
  already says it all.
- Use a single size per list, so the rows stay aligned.

**When NOT to use:**

- **For a person** — use `nph-avatar`.
- **As an icon** — for a symbol use `nph-icon`.
- **As a button for an action** — use `nph-button`.
- **With loading that never ends** — if the image does not come, show error.
- **With different sizes in the same list.**

## Variants

**By size:** the Figma property `tamanho`, with `mídia` as `media`.

| Size | Frame | Corner | Choose when |
|---|---|---|---|
| `xs` (default) | `image/size-xs`, 24 px | `image/radius-sm` | In the Figma set, with no usage rule of its own |
| `sm` | `image/size-sm`, 32 px | `image/radius-sm` | The table |
| `md` | `image/size-md`, 48 px | `image/radius-md` | The list |
| `lg` | `image/size-lg`, 64 px | `image/radius-md` | The product item and the upload |
| `xl` | `image/size-xl`, 96 px | `image/radius-lg` | The side card and the image template |
| `2xl` | `image/size-2xl`, 128 px | `image/radius-lg` | The side card and the image template |
| `media` | `image/media-width`, 256 px wide | `image/radius-lg` | The card, the gallery and the cover |

**By proportion:** the Figma property `proporção`, as `ratio`. Only `media` uses it.

| Ratio | Height in `media` |
|---|---|
| `1:1` (default) | 256 px |
| `4:3` | 192 px |
| `16:9` | 144 px |

**By density:** `not_applicable`.

**Choose this variant when:** the tables above say it.

**Do not combine with:** a `ratio` other than `1:1` outside `media`, which is ignored; a
size or a ratio outside the lists.

## States

The Figma property `estado` has two kinds of values. The content states derive from `src`
and the load; the interaction states come from the parent when the image is clickable.
The Figma `giro` is the rotation step of the spinner and is not a property: the spinner
turns by itself.

| State | Token | What changes for the person |
|---|---|---|
| Empty (`vazio`) | `image/background` | No `src`: the frame with its border. Until the illustrations arrive, nothing else |
| Loading (`carregando`) | `image/foreground` | The spinner turns at the center; the frame has no border |
| Loaded (`carregada`) | `image/border` | The image fills the frame and crops to keep its proportion; the border stays over it |
| Error (`erro`) | `image/background` | The image did not load: the frame with its border, as empty, until the illustrations arrive |
| Hover | `image/overlay` | Only on a clickable, loaded image: the veil with the eye in `image/on-overlay` |
| Focus (`foco`) | `image/focus-border` | Only on keyboard focus of a clickable image: the ring in `focus/ring-width`, just outside the frame and never over the photo |
| Disabled (`desabilitada`) | `state/disabled-opacity` | The whole piece fades; a clickable one takes no focus and no click |

**Feedback and focus:** the piece emits no event of its own. The host repeats the native
`load` and `error` of the inner image, without bubbling, and the read-only `status` says
the state drawn now. Only a clickable image takes the focus.

**Business rule the piece carries:**

- The area is the same in every state.
- The content state derives from `src`; it is not chosen by hand.
- Hover, focus and disabled exist only when the parent makes the image clickable.
- Empty and error draw the frame only until their illustrations arrive. The text that
  explains a failure belongs to the parent.
- The ratio only applies to `media`.

**Domain error states:** none. No `src` and no `alt` is valid and silent.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | With `alt`: `role="img"` and `aria-label` on the host. With an empty `alt`: `aria-hidden="true"`. A clickable image is an inner native button named by the `alt`, and the host has no role. The inner image has an empty `alt` |
| Accessible name | The `alt`, which describes the content. Empty when the text next to it says it all |
| Keyboard and focus | Only a clickable image receives focus: Tab reaches it, Enter and Space click it, and the ring `image/focus-border` in `focus/ring-width` shows. Otherwise the focus belongs to the control that contains it |
| Contrast | The spinner, `image/foreground` on `image/background`, and the focus ring pass 3:1 in light and dark, in every brand; the test measures them |
| Alternative to color | Loading changes the drawing to the spinner. Empty and error will change it to their illustrations; until those arrive, the parent's text carries the difference |
| Touch target | Does not apply to the image alone. When it is clickable, the target is the image area or the control that contains it |
| Motion | The spinner turns and stops with reduced motion (P66). The image itself has no animation |

## Relations

**Combines with:** `nph-spinner`, the arc that turns while the image loads; `nph-icon`,
the hover eye; `nph-avatar`, the piece for a person; `nph-button`, the piece for an
action. One piece is planned and does not exist yet: `nph-table`, which will take the
image for the thumbnail and the expanded item.

**What is the parent:** a table, a list, a card, a gallery, a cover or an upload. Next to
text, the space is `image/gap`, given by the container.

**What is the child:** `nph-spinner` and `nph-icon`. The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Frame size | `image/size-xs` to `image/size-2xl`; `image/media-width` in `media` |
| Frame radius | `image/radius-sm`, `image/radius-md`, `image/radius-lg` |
| Frame background | `image/background` |
| Spinner | `image/foreground` |
| Border | `image/border-width` in `image/border` |
| Veil and eye | `image/overlay`, `image/on-overlay`; the eye in `image/icon-size-sm`, `-md` or `-lg` |
| Focus ring | `image/focus-border` in `focus/ring-width` |
| Disabled | `state/disabled-opacity` |
| Illustration | `image/illustration-light`, `image/illustration-dark`, once the files arrive |

**Usage restrictions:** the component does not choose size, color or radius: everything
comes from a token. The space between the image and the text next to it comes from
whoever uses it, with `image/gap`. In a part of the screen with another brand,
`data-nph-brand` and `data-nph-color-scheme` go on the same element (P67). The
illustrations of empty and error are image assets that are not in the repository yet, and
`design.md` has no usage entry for the `image/*` tokens: both are pending decisions with
the design owner, recorded in P90.

**AI hints:**

- Use `nph-image` for the image of a product, file or content; for a person use
  `nph-avatar`, for a symbol `nph-icon`.
- Pass `src` and let the piece show loading, loaded or error by itself; leave `src` out
  for empty.
- Write an `alt` that describes the content, or leave it empty when the text next to it
  says it all.
- Choose the size by the place and keep a single size per list; `ratio` only matters in
  `media`.
- Set `interactive` only when the image opens something, such as a preview, and give it
  an `alt`; for any other action use `nph-button`.
- Listen to the `error` event of the host to write the text that explains a failure next
  to the image.

## Examples

**Recommended case:** a list of products, each with an `md` image, its `src` and no `alt`,
and the product name next to it, set apart by `image/gap`.

**Alternative case:** a card cover in `media` at `16:9`, with an `alt` that describes the
cover; an upload still without an image, in `lg` with no `src`, so the empty state shows.

## Anti-patterns

- **Do not use for a person** — use `nph-avatar`.
- **Do not use as an icon or as a button** — use `nph-icon` or `nph-button`.
- **Do not leave loading without an end** — if the image does not come, show error.
- **Do not mix sizes in the same list** — choose a single size.
- **Do not leave the area blank** — show empty or error.
- **Invalid combinations:** a size or a ratio outside the lists; `interactive` without
  `alt`.
- **Do not create without a decision:** a slot, a `::part`, an `nph-*` event, a property
  for the content state, a timeout, a caption or a form association.

## Sources and decisions

- **The repository `design.md`:** no entry yet for the `image/*` tokens,
  `overlay/on-media-strong` and `overlay/on-media-foreground` (a pending decision with the
  design owner); the tokens are in `src/tokens/source/semantic.tokens.json`.
- **The decision that originated it:** P90. The names `ratio`, `alt`, `interactive` and
  `disabled`, the derivation of the content state from `src`, the clickable image as an
  inner button and the sizes of the eye and the spinner are a technical proposal of this
  implementation.
- **Tests:** `src/components/nph-image/nph-image.test.ts`.
- **Usage evidence:** `nph-table` (planned) will take it for the thumbnail and the expanded
  item.
- **Storybook:** `src/components/nph-image/nph-image.stories.ts` (Validation) and
  `nph-image.docs.stories.ts` (Docs).
- **Figma:** `nph-image` board (`2573:66090`), frame `Documentação` (`2677:465`) and set
  `2573:66089` in `DS-IA-NEPHOS 5.0`.
