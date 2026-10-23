---
piece: nph-empty
level: component
status: active
solves: >-
  Says why an area has no content to show and what the person can do, with an
  illustration, a heading that says what is missing and an optional description that
  says what to do.
use_when:
  - "When a list or a search has no result: the heading says what is missing and the description suggests another search."
  - "When an area still has no content: the heading says what is missing."
  - "When there is nothing to suggest: leave the description empty and show only the heading."
  - "Write the heading as what is missing, because the person understands at once why the area is empty."
  - "Use the description to say what to do, because the empty state becomes a next step."
do_not_use_when:
  - "While the content loads: use the loading state of the piece that receives it, such as state=carregando in the nph-combobox list, or nph-skeleton."
  - "To say what failed: use the error message of the piece."
  - "To offer an action: the piece has no button and no link."
api:
  heading:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      What is missing, already localized by the consuming application. It is the Figma
      property título. The name is not title, the global HTML attribute, which the
      browser would show as a native tooltip. Empty or only spaces draws nothing and
      emits console.error in development.
  description:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      What the person can do, already localized. It is the Figma property descrição.
      The Figma boolean texto da descrição is not a property: the description shows when
      it is not empty and is left out when it is empty or only spaces.
variants: not_applicable
states:
  default:
    token: "color/foreground, color/muted-foreground"
    changes_for_user: "The illustration, the heading and, when given, the description; the piece does not change with interaction."
business_rules:
  - "The heading is always present and says what is missing."
  - "The description is optional and says what to do; it never repeats the heading."
  - "The illustration switches by itself with the color scheme, through scheme/is-light and scheme/is-dark; it is never chosen by hand."
  - "The piece has no action: no button and no link."
  - "The piece that receives the nph-empty gives the background and the position; the nph-empty gives only its own inner space."
  - "Loading is the state of the piece that receives it, not of the nph-empty."
domain_errors: []
tokens:
  padding: space/container-padding
  width: layout/input-width
  illustration_to_text: space/section
  heading_to_description: space/inline-tight
  heading_type: text/heading-xs
  heading_color: color/foreground
  description_type: text/body-sm
  description_color: color/muted-foreground
  illustration_light: scheme/is-light
  illustration_dark: scheme/is-dark
ai_hints:
  - "Use nph-empty when a list, a search or an area has no content to show; while the content loads, use the loading state of the piece that receives it."
  - "Write the heading as what is missing, such as No option found, never a vague word such as Empty."
  - "Use the description to say what to do; when there is nothing to suggest, leave it empty."
  - "Do not put a button or a link inside or next to the piece as part of it: the piece has no action."
  - "Do not choose the illustration: it follows data-nph-color-scheme."
accessibility:
  semantics: "The host has no role. The heading and the description are paragraphs of text and are read; the illustration is decorative, with an empty `alt` and `aria-hidden`. Announcing that a search found nothing belongs to the piece that receives the nph-empty."
  accessible_name: not_applicable
  keyboard: []
  focus: "The piece does not receive focus: it has no action."
  contrast: "The heading and the description pass 4.5:1 on color/background and on color/popover, in light and dark."
  color_alternative: "The message is in the text of the heading. The illustration only reinforces what the text says."
invalid_combinations:
  - "No heading — the piece draws nothing and emits console.error in development."
  - "A description that repeats the heading — use it to say what to do, or leave it empty."
  - "A button or a link as part of the piece — it has no action."
relations:
  combines_with: [nph-combobox]
  parents: [nph-combobox, list, search, area]
  children: []
  complements_block: []
  appears_in: []
anti_patterns:
  - "Writing a vague heading, such as Empty, instead of saying what is missing."
  - "Repeating the heading in the description."
  - "Using the nph-empty while the options load."
  - "Choosing the illustration by hand instead of letting it follow the color scheme."
sources:
  design_md: "design.md, space/container-padding, layout/input-width, space/section, space/inline-tight, text/heading-xs, text/body-sm, color/foreground, color/muted-foreground and tokens_scheme (scheme/is-light, scheme/is-dark)"
  decision: "P84 — API and semantics of nph-empty, 22-10-2026"
  tests: "src/components/nph-empty/nph-empty.test.ts"
  usage_evidence: "none in code yet; the accepted board shows the nph-combobox list in state=vazio"
  storybook: "src/components/nph-empty/nph-empty.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-empty board 1463:25260, frame 2003:688 and component 1463:25238"
---

# nph-empty

## Function

**The problem it solves:** says why an area has no content to show and what the person
can do. An illustration, a heading that says what is missing and an optional description
that says what to do.

**When to use:**

- When a list or a search has no result: the heading says what is missing and the
  description suggests another search.
- When an area still has no content: the heading says what is missing.
- When there is nothing to suggest: leave the description empty and show only the
  heading.
- Write the heading as what is missing, because the person understands at once why the
  area is empty.
- Use the description to say what to do, because the empty state becomes a next step.

**When NOT to use:**

- **While the content loads** — use the loading state of the piece that receives it,
  such as `state=carregando` in the `nph-combobox` list, or `nph-skeleton`.
- **To say what failed** — use the error message of the piece.
- **To offer an action** — the piece has no button and no link.

## Variants

`not_applicable`. The piece is one component with no variant. `heading` is the Figma
property `título` and `description` is `descrição`. The boolean `texto da descrição` is the
presence of a non-empty `description`.

**By size and density:** `not_applicable`.

**Do not combine with:** a button, a link or a loading indicator.

## States

| State | Token | What changes for the person |
|---|---|---|
| Default | `color/foreground`, `color/muted-foreground` | The illustration, the heading and, when given, the description; it does not change with interaction |

**Feedback and focus:** the piece does not receive focus nor react to interaction. It is
still: there is no motion to reduce.

**Business rule the piece carries:**

- The heading is always present and says what is missing.
- The description is optional and says what to do; it never repeats the heading.
- The illustration switches by itself with the color scheme, through `scheme/is-light`
  and `scheme/is-dark`; it is never chosen by hand.
- The piece has no action: no button and no link.
- The piece that receives the `nph-empty` gives the background and the position; the
  `nph-empty` gives only its own inner space.
- Loading is the state of the piece that receives it, not of the `nph-empty`.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | The host has no role. The heading and the description are paragraphs of text and are read; the illustration is decorative, `alt=""` and `aria-hidden` |
| Accessible name | `not_applicable` |
| Keyboard and focus | The piece does not receive focus: it has no action |
| Contrast | The heading and the description pass 4.5:1 on `color/background` and on `color/popover`, in light and dark |
| Alternative to color | The message is in the text of the heading; the illustration only reinforces it |
| Touch target | It is not interactive and has no touch target |
| Announcement | The piece is not a live region: the piece that receives it announces that the search found nothing |

## Relations

**Combines with:** `nph-combobox`, whose list in `state=vazio` shows an `nph-empty` when
the search finds no option. In `state=carregando` the list does not use it.

**What is the parent:** a list, a search result or an area with no content. The parent
gives the background and the position.

**What is the child:** nothing.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Box padding, on the four sides | `space/container-padding` |
| Box width | `layout/input-width` |
| Illustration to text group | `space/section` |
| Heading to description | `space/inline-tight` |
| Heading | `text/heading-xs`, `color/foreground` |
| Description | `text/body-sm`, `color/muted-foreground` |
| Light illustration | `scheme/is-light` |
| Dark illustration | `scheme/is-dark` |

**Usage restrictions:** the illustration is drawn at 120 × 87, the size of the asset and
not a token. The box never grows past its container: in a narrower one it shrinks and the
text wraps. It has no background and no border.

**AI hints:**

- Use `nph-empty` when a list, a search or an area has no content to show; while the
  content loads, use the loading state of the piece that receives it.
- Write the heading as what is missing, such as `No option found`, never a vague word
  such as `Empty`.
- Use the description to say what to do; when there is nothing to suggest, leave it
  empty.
- Do not put a button or a link inside or next to the piece as part of it: the piece has
  no action.
- Do not choose the illustration: it follows `data-nph-color-scheme`.

## Examples

**Recommended case:** the `nph-combobox` list in `state=vazio`, with `heading` saying that
no option was found and `description` suggesting to check what was typed or search for
another term.

**Alternative case:** an area still without content, or with nothing to suggest, with the
`heading` only.

## Anti-patterns

- **Do not write a vague heading, such as `Empty`** — say what is missing.
- **Do not repeat the heading in the description** — use the description to say what to
  do, or leave it empty.
- **Do not use the `nph-empty` while the options load** — in the `nph-combobox` list, use
  `state=carregando`.
- **Do not choose the illustration by hand** — it follows the color scheme.

## Sources and decisions

- **The repository `design.md`:** `space/container-padding`, `layout/input-width`,
  `space/section`, `space/inline-tight`, `text/heading-xs`, `text/body-sm`,
  `color/foreground`, `color/muted-foreground` and `tokens_scheme` (`scheme/is-light`,
  `scheme/is-dark`).
- **The decision that originated it:** P84, of 22-10-2026.
- **Tests:** `src/components/nph-empty/nph-empty.test.ts`.
- **Usage evidence:** none in code yet. The accepted board shows the `nph-combobox` list
  in `state=vazio`.
- **Storybook:** `src/components/nph-empty/nph-empty.stories.ts`.
- **Figma:** `nph-empty` board (`1463:25260`), frame `2003:688` and component `1463:25238`
  in `DS-IA-NEPHOS 5.0`.
- **Assets:** `assets/illustrations/empty-no-option-found.png` and
  `empty-no-option-found-dark.png`.
