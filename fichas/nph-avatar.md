---
piece: nph-avatar
level: component
status: active
solves: >-
  Shows who the person is, by the photo or, without a photo, by the person icon, in a
  square with rounded corners and a border drawn over the photo.
use_when:
  - "Next to a person's name, when the person needs to be recognized in a list, a field or a header."
  - "sm next to body text, in a list and in the select; md in a header, card and table row; lg in a profile."
  - "Without a photo, keep the avatar: it draws the person icon whenever there is no src or the image does not load."
  - "Put the person's name next to it: the avatar alone does not identify anyone with certainty."
  - "Use the same size for every avatar in a list."
do_not_use_when:
  - "As a button: the avatar receives no click and no focus."
  - "As an action icon: use nph-icon."
  - "As a circle: the avatar is a square with rounded corners, and there is no shape property."
  - "With an empty frame: leave src out and the person icon shows."
api:
  size:
    type: enum
    values: [sm, md, lg]
    required: false
    default: sm
    reflects: true
    constraint: >-
      The Figma property size. Reflects because the internal CSS selects the box by it.
      The frame is 24, 32 or 40 px. A value outside the list draws nothing and emits
      console.error in development.
  src:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The address of the photo. The Figma property `tipo` is not a property in code: it
      derives from src, with a present src as `foto` and no src as `sem foto`. Empty or
      whitespace-only counts as no src. The photo takes the place of the person icon on
      load, a failed photo leaves the icon, and a new src starts the wait again. No event
      is emitted. The name is a technical proposal of P74.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name. With text, the host takes role img and aria-label. Empty or
      whitespace-only, the host takes aria-hidden true. Without label is valid and silent,
      with no console.error. The name is a technical proposal of P74.
variants:
  size:
    axis: size
    choose_when: "sm next to body text, in a list and in the select; md in a header, card and table row; lg in a profile and person highlight."
    do_not_combine_with: []
  type:
    axis: appearance
    choose_when: "With src when the person has an image; without src when there is none, and the person icon shows. It is not a property: it derives from src."
    do_not_combine_with: []
states:
  default:
    token: color/muted
    changes_for_user: "A square frame with the photo, or with the person icon in color/muted-foreground; the border border/width in color/border stays over the photo. It has no state of its own."
business_rules:
  - "The avatar has no state of its own: no hover, no focus, no disabled and no animation."
  - "The frame is never empty: without a photo, while the photo loads and when it fails, the person icon shows."
  - "The frame is a square with rounded corners, never a circle, and there is no shape property."
  - "The border is drawn by the avatar inside the frame and over the photo; it keeps overlapped avatars apart."
  - "The name is next to the avatar: leave label out and the avatar is hidden from the screen reader; alone, pass label with the person's name."
domain_errors: []
tokens:
  size: [avatar/size-sm, avatar/size-md, avatar/size-lg]
  radius: [avatar/radius-sm, avatar/radius-md, avatar/radius-lg]
  background: color/muted
  icon_color: color/muted-foreground
  icon_size: [icon/size-sm, icon/size-md, icon/size-lg]
  border: [border/width, color/border]
ai_hints:
  - "Use nph-avatar next to a person's name, so the person is recognized faster; for an action icon, use nph-icon."
  - "Pass src when the person has a photo and leave it out when there is none: the person icon shows, and the frame is never empty."
  - "Leave label out when the name is next to the avatar, because the avatar is then hidden from the screen reader; alone, pass label with the person's name."
  - "Choose the size by the place: sm next to body text and in a list, md in a header and card, lg in a profile; use the same size for every avatar in a list."
  - "Do not use it as a button: the avatar receives no click and no focus."
  - "To hold the place of an avatar while a list loads, use nph-skeleton with the avatar shape of the same size."
accessibility:
  semantics: "An image on the host, or nothing. Without label, aria-hidden true and no role. With label, role img and aria-label on the host. The inner image has an empty alt. The avatar is never focusable and is not a button."
  accessible_name: "The label, when it has text. With the person's name next to the avatar, label stays out and the avatar is hidden from the screen reader."
  keyboard: []
  focus: "The piece does not receive focus and has no tabindex. Inside a control, the focus belongs to the control."
  contrast: "The person icon, color/muted-foreground on color/muted, passes 3:1 in light and dark, in every brand; nph-avatar.test.ts measures it by hand until the accessibility gate of P72 arrives. The photo is the person's image and is not measured."
  color_alternative: "The avatar does not communicate state, so there is nothing to tell apart by color."
invalid_combinations:
  - "A size outside sm, md and lg — the piece draws nothing."
  - "A circle or any other shape — the frame is a square with rounded corners and there is no shape property."
  - "Initials in place of the person icon — the avatar has no initials."
relations:
  combines_with: [nph-icon, nph-skeleton, nph-select, nph-avatar-stack]
  parents: ["list", "header", "card", "table row", "profile"]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the avatar as a button."
  - "Using the avatar as an action icon."
  - "Making the avatar a circle."
  - "Leaving the frame empty."
  - "Using different sizes for the avatars of one list."
  - "Using the avatar alone to identify a person, without the name."
sources:
  design_md: "design.md, avatar/size-*, avatar/radius-*, color/muted, color/muted-foreground, color/border, border/width and icon/size-*"
  decision: "P74 — API and semantics of nph-avatar, 20-10-2026"
  tests: "src/components/nph-avatar/nph-avatar.test.ts"
  usage_evidence: "none in code yet; nph-select (DSA-29) will take it at the start of the trigger and of the option, and nph-avatar-stack (DSA-25) will overlap a group of them"
  storybook: "src/components/nph-avatar/nph-avatar.stories.ts and nph-avatar.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-avatar frame 1434:30 and set 1434:29"
---

# nph-avatar

## Function

**The problem it solves:** shows who the person is, by the photo or, without a photo, by
the person icon. It goes next to a person's name, so the person is recognized faster. It
is not a button or an icon: it opens nothing by itself, does not stand for an action and
does not replace the written name.

**When to use:**

- Next to a person's name, when the person needs to be recognized in a list, a field or a
  header.
- `sm` next to body text, in a list and in the select; `md` in a header, card and table
  row; `lg` in a profile.
- Without a photo, keep the avatar: it draws the person icon whenever there is no `src` or
  the image does not load.
- Put the person's name next to it: the avatar alone does not identify anyone with
  certainty.
- Use the same size for every avatar in a list.

**When NOT to use:**

- **As a button** — the avatar receives no click and no focus.
- **As an action icon** — use `nph-icon`.
- **As a circle** — the avatar is a square with rounded corners, and there is no `shape`
  property.
- **With an empty frame** — leave `src` out and the person icon shows.

## Variants

**By appearance:** the Figma property `tipo` has two values, `foto` and `sem foto`. In code
it is not a property: it derives from `src`, with a present `src` as `foto` and no `src`
as `sem foto`. The default is inverted on purpose. In Figma the default is `foto`; in
code, the absence of `src` is the natural default, so `<nph-avatar>` with no attribute
draws `sem foto`.

| Variant | Choose when |
|---|---|
| With `src` (`foto`) | The person has an image |
| Without `src` (`sem foto`) | There is no image, or it does not load; the person icon shows |

**By size:**

| Size | Frame | Choose when |
|---|---|---|
| `sm` (default) | `avatar/size-sm`, 24 px | Next to body text, in a list and in the select |
| `md` | `avatar/size-md`, 32 px | In a header, card and table row |
| `lg` | `avatar/size-lg`, 40 px | In a profile and person highlight |

**By density:** `not_applicable`.

**Choose this variant when:** the tables above say it.

**Do not combine with:** a size outside `sm`, `md` and `lg`; a circle; initials.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/muted` | A square frame with the photo, or with the person icon in `color/muted-foreground`; the border stays over the photo |

**Feedback and focus:** the piece has no state of its own: no hover, no focus, no disabled
and no animation. It does not receive focus. The photo has a wait, which is not a state of
the piece: while it loads and when it fails, the person icon shows; when it loads, it
takes the icon's place. No event is emitted.

**Business rule the piece carries:**

- The frame is never empty: without a photo, while the photo loads and when it fails, the
  person icon shows.
- The frame is a square with rounded corners, never a circle.
- The border is drawn by the avatar, inside the frame and over the photo, and it keeps
  overlapped avatars apart. There is no property for it.
- Without `label`, the avatar is hidden from the screen reader; with `label`, it is an
  image with that name.

**Domain error states:** none. No `src` and no `label` is valid and silent.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Without `label`: `aria-hidden="true"` on the host, no role. With `label`: `role="img"` and `aria-label` on the host. The inner image has an empty `alt`. The avatar is not a button |
| Accessible name | The `label`, when it has text. With the name next to the avatar, leave `label` out; alone, pass the person's name |
| Keyboard and focus | The piece does not receive focus and has no `tabindex`. Inside a control, the focus belongs to the control |
| Contrast | The person icon, `color/muted-foreground` on `color/muted`, passes 3:1 in light and dark, in every brand; the test measures it by hand until the accessibility gate (P72) arrives. The photo is not measured |
| Alternative to color | The avatar does not communicate state |
| Touch target | It is not interactive and has no touch target. The target is the one of the control that contains it |
| Motion | None: the avatar has no animation and no transition |

## Relations

**Combines with:** `nph-icon`, which draws the person icon inside the avatar and is the
piece for an action icon; `nph-skeleton`, whose avatar shape holds the place of the avatar
in the same size while a list loads. Two pieces are planned and do not exist yet:
`nph-select` (DSA-29), which will take the avatar at the start of the trigger and of each
option, in size `sm`, and `nph-avatar-stack` (DSA-25), which will overlap a group of
avatars.

**What is the parent:** a list, a header, a card, a table row or a profile, next to the
person's name, set apart by `space/inline`.

**What is the child:** `nph-icon`, the person icon. The piece has no slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Frame size | `avatar/size-sm`, `avatar/size-md`, `avatar/size-lg` |
| Frame radius | `avatar/radius-sm`, `avatar/radius-md`, `avatar/radius-lg` |
| Frame background | `color/muted` |
| Person icon | `color/muted-foreground`, in `icon/size-sm`, `icon/size-md` and `icon/size-lg` by the avatar size |
| Border | `border/width` in `color/border` |

**Usage restrictions:** the component does not choose size, color or radius: everything
comes from a token. The piece has no motion. The space between the avatar and the name
comes from whoever uses it, with `space/inline`. In a part of the screen with another
brand, `data-nph-brand` and `data-nph-color-scheme` go on the same element (P67). The
`use` of some tokens in `design.md` is narrower than the accepted Figma (`color/muted`,
`color/muted-foreground`, `color/border` and `icon/size-*`), and `avatar/radius-*` is also
consumed by `nph-skeleton`: widening it is a pending decision with Indiane, recorded as
D5 of DSA-24 and in P74.

**AI hints:**

- Use `nph-avatar` next to a person's name, so the person is recognized faster; for an
  action icon, use `nph-icon`.
- Pass `src` when the person has a photo and leave it out when there is none: the person
  icon shows, and the frame is never empty.
- Leave `label` out when the name is next to the avatar, because the avatar is then hidden
  from the screen reader; alone, pass `label` with the person's name.
- Choose the size by the place: `sm` next to body text and in a list, `md` in a header and
  card, `lg` in a profile; use the same size for every avatar in a list.
- Do not use it as a button: the avatar receives no click and no focus.
- To hold the place of an avatar while a list loads, use `nph-skeleton` with the avatar
  shape of the same size.

## Examples

**Recommended case:** a list of people, each with an `sm` avatar, the person's `src` when
there is a photo and no `src` when there is not, and the name beside it, set apart by
`space/inline`. The avatars have no `label`, because the name is right there.

**Alternative case:** a profile header with an `lg` avatar and no `src`, so the person icon
shows, and the person's name as `label` when the name is not written beside it.

## Anti-patterns

- **Do not use as a button** — the avatar receives no click and no focus.
- **Do not use as an action icon** — use `nph-icon`.
- **Do not make it a circle** — the frame is a square with rounded corners.
- **Do not leave the frame empty** — leave `src` out and the person icon shows.
- **Do not mix sizes in one list** — use the same size for every avatar.
- **Do not use the avatar alone to identify a person** — put the name next to it.
- **Invalid combinations:** a size outside `sm`, `md` and `lg`; a circle; initials.
- **Do not create without a decision:** a `shape` property, a slot, a `::part`, an event,
  initials, a counting mode or a form association.

## Sources and decisions

- **The repository `design.md`:** `avatar/size-*`, `avatar/radius-*`, `color/muted`,
  `color/muted-foreground`, `color/border`, `border/width` and `icon/size-*`.
- **The decision that originated it:** P74, of 20-10-2026. The frame was accepted by
  Indiane on 06-10-2026; the answers to D1 to D4, of 19-10-2026. The names `src` and
  `label` and the derivation of `tipo` from `src` are a technical proposal of this
  implementation.
- **Tests:** `src/components/nph-avatar/nph-avatar.test.ts`.
- **Usage evidence:** none in code yet. `nph-select` (DSA-29, planned) and
  `nph-avatar-stack` (DSA-25, planned) will consume it.
- **Storybook:** `src/components/nph-avatar/nph-avatar.stories.ts` (Validation) and
  `nph-avatar.docs.stories.ts` (Docs).
- **Figma:** `nph-avatar` frame (`1434:30`) and set `1434:29` in `DS-IA-NEPHOS 5.0`.
