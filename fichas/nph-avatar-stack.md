---
piece: nph-avatar-stack
level: component
status: active
solves: >-
  Shows several people in a short space, as a row of overlapping nph-avatar
  pieces, with the count of who does not show, read as one image by the name of
  the group.
use_when:
  - "To show who takes part in something, such as owners, members or participants, without listing everyone."
  - "Show up to the 5th avatar; whoever does not show enters the count."
  - "Turn on the count when there are more people than avatars, because the total must show."
  - "sm in a list and in the select; md in a header, card and table row; lg in a profile."
  - "Give the group a label with the names and the total, because the avatars are not read."
do_not_use_when:
  - "For a single person: use nph-avatar."
  - "As the list of people with their names: the group does not replace it."
  - "To space avatars without overlap: nph-avatar-stack already brings avatar/overlap."
  - "To mix sizes in the group: the group has a single size and writes it on every avatar."
  - "Past the 5th avatar: put whoever does not show in the count."
api:
  size:
    type: enum
    values: [sm, md, lg]
    required: false
    default: sm
    reflects: true
    constraint: >-
      The Figma property size, the same sizes as nph-avatar. Reflects because the
      internal CSS selects the count by it. The group writes it on every child
      avatar, also when a child changes its own afterwards, so a size on a child
      does not survive. A value outside the list draws nothing and emits
      console.error in development.
  count:
    type: number
    required: false
    default: 0
    reflects: false
    constraint: >-
      How many people do not show, the Figma properties `mostrar contagem` and
      `contagem`. A whole number from zero up. Above zero, the group draws +N at the
      end, overlapping the last avatar; zero, or no attribute, draws no count. A
      negative number, a broken number or text draws nothing and emits
      console.error in development. The name is a technical proposal of P78.
  label:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      The name of the group, already localized, with the names and the total, such
      as Ana, Bruno, Carla and 3 more. It becomes the aria-label of the host, which
      is the role img. A name the consumer puts on the host with aria-label or
      aria-labelledby also counts. Without any name, the group draws nothing and
      emits console.error in development.
  slot:
    type: "default slot"
    required: true
    default: "none"
    reflects: false
    constraint: >-
      The nph-avatar children, each with its own src, from the 2nd to the 5th. The
      Figma properties `mostrar 3º`, `mostrar 4º` and `mostrar 5º` are the number of
      children, not properties. Fewer than two or more than five avatars, a child
      that is not an nph-avatar and an avatar with a label of its own render anyway
      and warn in development.
variants:
  size:
    axis: size
    choose_when: "sm in a list and in the select; md in a header, card and table row; lg in a profile."
    do_not_combine_with: []
  count:
    axis: content
    choose_when: "With a count when there are more people than avatars; without one when every person shows."
    do_not_combine_with: []
states:
  default:
    token: avatar/overlap
    changes_for_user: "A row of avatars, each over the previous one, and the +N count over the last one. The group has no state of its own: no hover, no focus, no disabled and no animation."
business_rules:
  - "The group has a single size: it writes its size on every child avatar."
  - "Each avatar goes over the previous one by avatar/overlap, and the count goes over the last avatar."
  - "The separation between avatars is the border of each nph-avatar; the group draws no ring, background or border of its own."
  - "The group is read as one image, by its label; the avatars and the count are hidden from the screen reader."
  - "The group does not check that label and count agree: whoever uses it writes both."
domain_errors: []
tokens:
  overlap: avatar/overlap
  count_size: [avatar/size-sm, avatar/size-md, avatar/size-lg]
  count_radius: [avatar/radius-sm, avatar/radius-md, avatar/radius-lg]
  count_padding: space/inline-tight
  count_background: color/muted
  count_border: [border/width, color/border]
  count_text: color/muted-foreground
  count_typography: [text/label-sm, text/label-md]
ai_hints:
  - "Use nph-avatar-stack to show who takes part without listing everyone; for a single person, use nph-avatar."
  - "Put from two to five nph-avatar children in the group, each with its own src, and the rest in count."
  - "Set size on the group, not on the avatars: the group writes it on each one."
  - "Give the group a label with the names and the total, already localized; leave the avatars without label."
  - "Keep label and count in agreement: the group does not check them."
  - "Next to a text, such as the team name, give the space space/inline yourself."
accessibility:
  semantics: "The host is one image, role img, named by label. The slot and the count sit in one aria-hidden wrapper, so the avatars and the count are not read, even an avatar with a label of its own. The group is never focusable."
  accessible_name: "The label: the names and the total, such as Ana, Bruno, Carla and 3 more, written by whoever uses the group, in its language. aria-label or aria-labelledby on the host also count."
  keyboard: []
  focus: "The piece does not receive focus and has no tabindex. When the group opens the list of people, the focus belongs to the control around it."
  contrast: "The +N text, color/muted-foreground on color/muted, passes 4.5:1 in light and dark, in every brand; nph-avatar-stack.test.ts measures it by hand until the accessibility gate of P72 arrives."
  color_alternative: "Each person shows by photo or person icon, and the total shows as text."
invalid_combinations:
  - "A size outside sm, md and lg — the group draws nothing."
  - "A count that is not a whole number from zero up — the group draws nothing."
  - "No name — no label, no aria-label and no aria-labelledby: the group draws nothing."
  - "Fewer than two or more than five avatars — the group renders and warns in development."
  - "A child that is not an nph-avatar — it is not part of the group; the group warns in development."
  - "An avatar with a label of its own — the group still reads only its own name and warns in development."
relations:
  combines_with: [nph-avatar]
  parents: ["list", "header", "card", "table row", "profile"]
  children: [nph-avatar]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Spacing avatars without overlap."
  - "Mixing sizes in the group."
  - "Going past the 5th avatar."
  - "Leaving the group without a name with the people and the total."
  - "Using the group for a single person."
  - "Using the group in place of the list of people with their names."
sources:
  design_md: "design.md, avatar/overlap, avatar/size-*, avatar/radius-*, color/muted, color/muted-foreground, color/border, border/width, space/inline-tight, text/label-sm and text/label-md"
  decision: "P78 — API and semantics of nph-avatar-stack"
  tests: "src/components/nph-avatar-stack/nph-avatar-stack.test.ts"
  usage_evidence: "none in code yet"
  storybook: "src/components/nph-avatar-stack/nph-avatar-stack.stories.ts and nph-avatar-stack.docs.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-avatar-stack frame 1579:46 and set 1579:45"
---

# nph-avatar-stack

## Function

**The problem it solves:** shows several people in a short space, as a row of overlapping
`nph-avatar` pieces, with the count of who does not show. The group is read as one image,
by its name, with the names and the total. It does not replace the list of people with
their names, nor the single `nph-avatar` next to a name.

**When to use:**

- To show who takes part in something, such as owners, members or participants, without
  listing everyone.
- Show up to the 5th avatar; whoever does not show enters the count.
- Turn on the count when there are more people than avatars, because the total must show.
- `sm` in a list and in the select; `md` in a header, card and table row; `lg` in a
  profile.
- Give the group a `label` with the names and the total, because the avatars are not read.

**When NOT to use:**

- **For a single person** — use `nph-avatar`.
- **As the list of people with their names** — the group does not replace it.
- **To space avatars without overlap** — `nph-avatar-stack` already brings
  `avatar/overlap`.
- **To mix sizes in the group** — the group has a single size and writes it on every
  avatar.
- **Past the 5th avatar** — put whoever does not show in the count.

## Variants

**By size:** the same sizes as `nph-avatar`. The group writes its `size` on every avatar,
and the count takes the same height.

| Size | Avatar and count height | Count text | Choose when |
|---|---|---|---|
| `sm` (default) | `avatar/size-sm` | `text/label-sm` | In a list and in the select |
| `md` | `avatar/size-md` | `text/label-sm` | In a header, card and table row |
| `lg` | `avatar/size-lg` | `text/label-md` | In a profile |

**By content:** the Figma properties `mostrar 3º`, `mostrar 4º` and `mostrar 5º` are the
number of `nph-avatar` children; `mostrar contagem` and `contagem` are `count`. Photo or no
photo is chosen on each avatar, by its `src`.

**By density:** `not_applicable`.

**Choose this variant when:** the table above says it.

**Do not combine with:** sizes mixed in the group; more than five avatars.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `avatar/overlap` | A row of avatars, each over the previous one, and the "+N" count over the last one |

**Feedback and focus:** the group has no state of its own: no hover, no focus, no disabled
and no animation. It does not receive focus.

**Business rule the group carries:**

- The group has a single size: it writes its `size` on every child avatar, also when a
  child changes its own.
- Each avatar goes over the previous one by `avatar/overlap`, and the count goes over the
  last avatar.
- The separation between avatars is the border of each `nph-avatar`; the group draws no
  ring, background or border of its own.
- The group is read as one image, by its `label`; the avatars and the count are hidden
  from the screen reader.
- The group does not check that `label` and `count` agree: whoever uses it writes both.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is one image, `role` img, named by `label`. The slot and the count sit in one `aria-hidden` wrapper, so the avatars and the count are not read, even an avatar with a `label` of its own |
| Accessible name | The `label`: the names and the total, such as "Ana, Bruno, Carla and 3 more", already localized. `aria-label` or `aria-labelledby` on the host also count |
| Keyboard and focus | The piece does not receive focus and has no `tabindex`. When the group opens the list of people, the focus belongs to the control around it |
| Contrast | The "+N" text, `color/muted-foreground` on `color/muted`, passes 4.5:1 in light and dark, in every brand; the test measures it by hand until the accessibility gate (P72) arrives |
| Alternative to color | Each person shows by photo or person icon, and the total shows as text |
| Touch target | It is not interactive and has no touch target |
| Motion | None: the group has no animation and no transition |

## Relations

**Combines with:** `nph-avatar`, the pieces it is made of: photo, person icon, corner and
border come from each avatar.

**What is the parent:** a list, a header, a card, a table row or a profile. Next to a text,
such as the team name, the space is `space/inline`, given by whoever uses the group.

**What is the child:** `nph-avatar`, in the default slot.

**Which block this piece complements:** none yet.

**Appears in layouts:** none yet.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Overlap | `avatar/overlap`, between every two neighbors, the count included |
| Avatar | Every token from `nph-avatar`, in the size of the group |
| Count box | `avatar/size-*` high and at least as wide, `avatar/radius-*`, side padding `space/inline-tight` |
| Count colors | Background `color/muted`; border `border/width` in `color/border`, inside; text `color/muted-foreground` |
| Count text | `text/label-sm` in `sm` and `md`, `text/label-md` in `lg` |

**Usage restrictions:** the group chooses no color, size or radius of its own: everything
comes from a token. The overlap is a negative start margin, because a gap cannot be
negative, and the paint order is the order of the children. The `use` of some tokens in
`design.md` is narrower than the accepted Figma (`text/label-sm`, `text/label-md`,
`color/muted`, `color/border`, `space/inline-tight`, `avatar/size-*` and `avatar/radius-*`
for the count): widening it is a pending decision with Indiane, D4 of DSA-25, and the
component consumes them as the Figma binds them either way. In a part of the screen with
another brand, `data-nph-brand` and `data-nph-color-scheme` go on the same element (P67).

**AI hints:**

- Use `nph-avatar-stack` to show who takes part without listing everyone; for a single
  person, use `nph-avatar`.
- Put from two to five `nph-avatar` children in the group, each with its own `src`, and
  the rest in `count`.
- Set `size` on the group, not on the avatars: the group writes it on each one.
- Give the group a `label` with the names and the total, already localized; leave the
  avatars without `label`.
- Keep `label` and `count` in agreement: the group does not check them.
- Next to a text, such as the team name, give the space `space/inline` yourself.

## Examples

**Recommended case:** the owners of a task, at size `md`, three avatars next to the task,
with the `label` "Owners: Ana Souza, Bruno Lima and Carla Mendes".

**Alternative case:** the participants of a meeting, at size `md`, five avatars and
`count` 4; or the members of a team in a list, at size `sm`, three avatars and the count,
before the team name.

## Anti-patterns

- **Do not space avatars without overlap** — use `nph-avatar-stack`, which brings
  `avatar/overlap`.
- **Do not mix sizes in the group** — use a single size, on the group.
- **Do not go past the 5th avatar** — use the "+N" count for whoever does not show.
- **Do not leave the group without a name** — the avatars are not read.
- **Do not use the group for a single person** — use `nph-avatar`.
- **Do not use the group in place of the list of people with their names.**
- **Invalid combinations:** a `size` outside `sm`, `md` and `lg`; a `count` that is not a
  whole number from zero up; no name; fewer than two or more than five avatars; a child
  that is not an `nph-avatar`; an avatar with a `label` of its own.
- **Do not create without a decision:** a property per avatar, a maximum in code, an
  automatic count, a color property, an event, a `::part` or a ring around the avatars.

## Sources and decisions

- **The repository `design.md`:** `avatar/overlap`, `avatar/size-*`, `avatar/radius-*`,
  `color/muted`, `color/muted-foreground`, `color/border`, `border/width`,
  `space/inline-tight`, `text/label-sm` and `text/label-md`.
- **The decision that originated it:** P78. The frame was accepted by Indiane; D1 to D3 of
  DSA-25 answered the count typography, the overlap of the count and the separation. The
  names `count` and `label`, the slot, the semantics of the host and the invalid input and
  composition rules are a technical proposal of this implementation.
- **Tests:** `src/components/nph-avatar-stack/nph-avatar-stack.test.ts`.
- **Usage evidence:** none in code yet.
- **Storybook:** `src/components/nph-avatar-stack/nph-avatar-stack.stories.ts`
  (Validation) and `nph-avatar-stack.docs.stories.ts` (Docs).
- **Figma:** `nph-avatar-stack` frame (`1579:46`) and set `1579:45` in `DS-IA-NEPHOS 5.0`.
