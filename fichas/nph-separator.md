---
piece: nph-separator
level: component
status: active
solves: >-
  Separates sibling items or regions of a container with a decorative line, without
  carrying state or creating space.
use_when:
  - "Separating groups of items in a menu."
  - "Separating side-by-side actions in an action bar."
  - "Separating the header from the content in a card."
do_not_use_when:
  - "Outlining a field — the field border is color/input, which meets 3:1."
  - "Spacing two blocks apart — the space comes from space/stack or space/section."
  - "Putting a word in the middle of the divider — there is no variant with text."
api:
  orientation:
    type: enum
    values: [horizontal, vertical]
    required: false
    default: horizontal
    reflects: true
    constraint: >-
      Reflects because the internal CSS selects the line by it. horizontal between
      stacked items; vertical between side-by-side items. A value outside the list
      draws nothing and emits console.error in development.
variants:
  orientation:
    axis: appearance
    choose_when: "horizontal between stacked items; vertical between side-by-side items."
    do_not_combine_with: [text]
states:
  default:
    token: color/border
    changes_for_user: "A line separates the items; it does not change with interaction."
business_rules:
  - "The thickness is always border/width and the color is always color/border: changing either would turn the divider into a state signal."
  - "The horizontal one fills the width in a block parent or a column flex parent; the vertical one fills the height in a row flex or grid parent. Otherwise, whoever uses it gives the length."
domain_errors: []
tokens:
  color: color/border
  thickness: border/width
ai_hints:
  - "Use nph-separator to separate sibling items or regions; to space blocks apart, use space/stack or space/section."
  - "Use orientation vertical between side-by-side items, inside a row flex parent."
  - "Do not use nph-separator as a field border: the field uses color/input."
accessibility:
  semantics: "The host is `aria-hidden`: the divider is decorative and stays out of the accessibility tree."
  accessible_name: not_applicable
  keyboard: []
  focus: "The divider does not receive focus."
  contrast: "It is decorative: color/border does not need to meet 3:1."
  color_alternative: "The divider carries no state; the separation is structural."
invalid_combinations:
  - "Text in the middle of the divider — there is no variant with text."
  - "A different thickness or color — the divider would become a state signal."
relations:
  combines_with: [nph-button]
  parents: [menu, action bar, card]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the divider as a field border."
  - "Using the divider as a spacer."
  - "Putting text in the middle of the divider."
  - "Changing the thickness or the color of the divider."
sources:
  design_md: "design.md, color/border, border/width and layout/separator-width and layout/separator-height, which are the length of the master in Figma"
  decision: "P66 — API and semantics of nph-spinner, nph-separator and nph-kbd, 05-10-2026"
  tests: "src/components/nph-separator/nph-separator.test.ts"
  usage_evidence: "none in code yet; the accepted frame shows menu, action bar and card"
  storybook: "src/components/nph-separator/nph-separator.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-separator frame 1196:674 and set 762:6"
---

# nph-separator

## Function

**The problem it solves:** separates sibling items or regions of a container with a
decorative line. It separates; it does not space apart.

**When to use:**

- Between groups of items in a menu.
- Between side-by-side actions in an action bar.
- Between the header and the content of a card.

**When NOT to use:**

- **As a field border** — the field uses `color/input`, which meets 3:1.
- **As a spacer** — the space between blocks comes from `space/stack` or
  `space/section`.
- **With text in the middle** ("or", "and") — there is no variant with text.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `orientation` | `horizontal` (default), `vertical` | `horizontal` between stacked items; `vertical` between side-by-side items |

**By size and density:** `not_applicable`.

**Do not combine with:** text, a different thickness or color.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/border` | A line separates the items; it does not change with interaction |

**Feedback and focus:** the divider does not receive focus nor react to interaction.

**Business rule the piece carries:** the thickness is always `border/width` and the color
is always `color/border`. The horizontal one fills the width in a block parent or a column
flex parent; the vertical one fills the height in a row flex or grid parent. Otherwise, whoever
uses it gives the length.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host is `aria-hidden`: the divider is decorative |
| Accessible name | `not_applicable` |
| Keyboard and focus | The divider does not receive focus |
| Contrast | It is decorative: `color/border` does not need to meet 3:1 |
| Alternative to color | The divider carries no state |

## Relations

**Combines with:** `nph-button`, in an action bar.

**What is the parent:** a menu, between groups of items; an action bar; and a card, between
header and content.

**What is the child:** nothing.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Color | `color/border` |
| Thickness | `border/width` |

**Usage restrictions:** the length comes from the container. `layout/separator-width` and
`layout/separator-height` are the length of the master in Figma and are not used in
code.

**AI hints:**

- Use `nph-separator` to separate sibling items or regions; to space blocks apart, use
  `space/stack` or `space/section`.
- Use `orientation="vertical"` between side-by-side items, inside a row flex
  parent.
- Do not use `nph-separator` as a field border: the field uses `color/input`.

## Examples

**Recommended case:** in a menu, a horizontal `nph-separator` between the profile group and
the sign-out action.

**Alternative case:** in an action bar, a vertical `nph-separator` between "Edit" and
"Delete", in a row flex parent.

## Anti-patterns

- **Do not use as a field border** — use `color/input`.
- **Do not use as a spacer** — use `space/stack` or `space/section`.
- **Do not put text in the middle** — there is no variant with text.
- **Do not change the thickness or color** — the divider would become a state signal.

## Sources and decisions

- **The repository `design.md`:** `color/border`, `border/width`,
  `layout/separator-width` and `layout/separator-height`.
- **The decision that originated it:** P66, of 05-10-2026.
- **Tests:** `src/components/nph-separator/nph-separator.test.ts`.
- **Usage evidence:** none in code yet. The accepted frame shows the divider
  in a menu, an action bar and a card.
- **Storybook:** `src/components/nph-separator/nph-separator.stories.ts`.
- **Figma:** `nph-separator` frame (`1196:674`) and set `762:6` in
  `DS-IA-NEPHOS 5.0`.
