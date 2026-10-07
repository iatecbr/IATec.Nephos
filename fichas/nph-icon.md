---
piece: nph-icon
level: component
status: active
title: "nph-icon"
type: component spec
created: 2026-08-31
updated: 2026-09-14
solves: >-
  Provides an icon from the Nephos core with consistent size, family and accessibility,
  without introducing color or artwork outside the approved collection.
use_when:
  - "A control or content needs an icon that exists in the core."
  - "The icon reinforces a label, state or direction without replacing the textual information."
do_not_use_when:
  - "The action has a consequence or is domain-specific — use a text label alongside."
  - "The icon you need does not exist in the core: record the gap and ask."

api:
  name:
    type: string
    required: true
    default: none
    reflects: false
    constraint: >-
      In kebab-case, and limited to the core names. A name outside the core does not
      render and emits an error only in development.
  variant:
    type: enum
    values: [regular, solid]
    required: false
    default: regular
    reflects: false
    constraint: >-
      `regular` is the default; `solid` is available for every name in the collection.
      I7 authorized `circle-info` in `solid` because the regular outline disappears
      next to text, especially in light mode. Light, Thin and Sharp do not
      exist in the contract.
  size:
    type: enum
    values: [sm, md, lg]
    required: true
    default: none
    reflects: true
    constraint: >-
      Reflects as an attribute because the internal CSS selects the box by it. It does not
      accept a free value and has no default — when absent, the icon does not render.
  label:
    type: string
    required: false
    default: empty
    reflects: false
    constraint: >-
      Absent, empty or whitespace-only makes the icon decorative and applies
      `aria-hidden`. A non-empty value becomes the accessible name.
  slots: none
  events: none
  color: >-
    It is not a property. It inherits `currentColor` from the context — there is no icon
    color token.

variants:
  variant:
    axis: appearance
    choose_when: "regular by default; solid when the context asks for greater visual presence"
    do_not_combine_with: ["light, thin, sharp"]
  size:
    axis: size
    choose_when: "sm inside a control and cell; md in menu and tab; lg when the icon carries meaning on its own"
    do_not_combine_with: ["free size value"]

states:
  not_applicable:
    token: not_applicable
    changes_for_user: "The state belongs to the control that consumes the icon, not to the icon"

business_rules: []
domain_errors: []

tokens:
  size: [icon/size-sm, icon/size-md, icon/size-lg]
  color: currentColor

ai_hints:
  - "An action with a consequence never takes an icon alone — add text."
  - "When in doubt about size, `size=sm`."
  - "Do not look for a color property: it does not exist, the icon inherits from the context."
  - "An icon next to text is decorative: leave `label` empty."
  - "An icon alone in a control: the `label` goes on the control, not on the icon."

accessibility:
  semantics: "No role of its own. Decorative by default"
  accessible_name: "Comes from `label`; empty marks it as decorative and applies aria-hidden"
  keyboard: []
  focus: "It never receives focus. Focus belongs to the enclosing control"
  contrast: "Meaningful icon: 3:1 against the background (WCAG 1.4.11)"
  color_alternative: "An icon is never the only signal of a state"

invalid_combinations:
  - "`size` absent — there is no default"
  - "Duotone outside structural navigation"

relations:
  combines_with: [nph-button, nph-spinner]
  parents: [nph-button, "the controls that contain it"]
  children: []
  complements_block: [pending]
  appears_in: [pending]

anti_patterns:
  - "An icon alone in an action with a consequence"
  - "Painting the icon with a color other than the context color"
  - "Using a size outside the three tokens"
  - "Simulating Duotone with artwork or an empty variant"

sources:
  design_md: "design.md, in the repository"
  decision: "P21, adopted by Indiane on 26-08-2026; I7, 08-09-2026"
  tests: "src/components/nph-icon/nph-icon.test.ts"
  usage_evidence: "branch v/3.0.0, PR #6, merge 437dd60"
  storybook: "src/components/nph-icon/nph-icon.stories.ts"
  figma: "page NPH — Icon (346:2)"
tags: [nephos, ds-agentico, ficha, componente, nph-icon]
---

> **References marked `(vault)`** are in `02 PROJETOS/DS-Agentico/`, in the WORK BRAIN —
> outside this repository. They were Obsidian wikilinks and were converted into an
> explicit reference in the migration of 31-08-2026.

# nph-icon

> **The API is in the YAML block above**, and that is where it lives — Indiane's decision on
> 31-08-2026. This text answers **when to choose this piece**, not what it accepts.
>
> The collection, family, size and color rules belong to `Fundação — ícones` (Foundation — icons) (vault). This spec
> does not repeat them: it points to them.
>
> Back to `Índice — DS-Agentico` (Index — DS-Agentico) (vault).

## Function

**The problem it solves:** gives Nephos controls and content a curated, accessible and
consistent icon, without leaving room for artwork or color outside the approved collection.

**When to use:** when a control or content needs one of the **core
icons**, to reinforce a label, a state, a direction or a recurring universal
action.

**When NOT to use:**

- **As a label substitute** in an action with a consequence — delete, approve, publish,
  export — or in any domain-specific action. Text goes there.
- **When the icon does not exist in the core.** It is a gap: ask, do not draw.
- **When the icon only repeats the label next to it.** If the text already says everything, the icon takes up
  space without adding anything.

## Variants

**By appearance — `variant`:** `regular` is the default. `solid` exists for every name
in the collection and is used when the context asks for greater visual presence. I7 (08-09-2026)
authorized `circle-info` in `solid` because the regular outline disappears next to text,
especially in light mode.

**By size — `size`:** `sm` inside a control, table cell and field; `md` in a menu
item, tab and highlighted action; `lg` when the icon carries meaning on its own —
empty state, section header. **When in doubt, `sm`.**

**By density:** `not_applicable`. The icon has no density axis; what changes
density is the surrounding control.

**Do not combine with:** free size and the Light, Thin and Sharp families — which do not exist
in the contract.

## States

**Supported states: `not_applicable`.** The icon has no state of its own — **the state
belongs to the control that consumes it**. Hover, focus, selected and disabled belong to the
button, the menu item, the table row.

**That is why there is no state token in this spec.** The icon inherits `currentColor`: when the
context changes state, the icon color follows without the icon knowing it.

**What changes for the person:** the icon reinforces the available information without duplicating it.

**Feedback and focus:** **the icon never receives focus.** Focus and the touch target belong to the
enclosing control — the 16 icon is not the target.

**Box and wide icons:** `eye`, `eye-slash` and `star` may overflow
horizontally, centered, **without clipping and without rescaling**. The box stays square and
the drawing is scaled by height.

**Invalid input:** `name` outside the core, `size` absent or outside the list, or a
nonexistent `variant` **do not render an icon** and emit a development error in the
console — **only in a development environment**. Each failure emits its own
error, so whoever is developing sees all the causes, not just the first.

> ⚠️ **Open item — PF-08.** States and focus of the icon **inside an icon-only
> button** are not decided. See `Pendências do Nephos` (Nephos open items) (vault).

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | No role of its own. **Decorative by default** |
| Accessible name | Comes from `label`. **Absent, empty or whitespace-only → decorative, with `aria-hidden`** |
| Icon next to text | `label` empty. Otherwise the screen reader reads the same thing twice |
| Icon without visible text | The accessible label is **mandatory** — and when the icon is inside a control, it goes **on the control** |
| Keyboard and focus | **Never receives focus on its own** |
| Contrast | Meaningful icon: **3:1** against the background — WCAG 1.4.11 |
| Alternative to color | **An icon is never the only signal** of a state. A state carries icon, color and text |

## Relations

**Combines with:** `nph-button` and `nph-spinner`.

**What is the parent — where this icon appears inside:** the controls that contain it.
`nph-button` is the first, and `nph-spinner` uses the `circle-notch` artwork from this core.

**What is the child:** nothing. `nph-icon` is a leaf — it contains no other piece.

**Which block it complements:** `pending`. Phase 5 has not started and no block has been extracted
from a real screen.

**Appears in layouts:** `pending`, for the same reason.

**The dependency that orders the queue:** `nph-icon` comes **before** `nph-icon-button`,
`nph-spinner` and `nph-badge`.

## Tokens, intent and AI hints

**Semantic tokens used:** `icon/size-sm`, `icon/size-md` and `icon/size-lg`.

**Usage restrictions:**

- The color inherits `currentColor`. **There is no icon color token**, and the component does not
  consume `core/*` directly.
- `space/inline-tight`, the space between icon and text, **belongs to the container that composes the
  two** — not to `nph-icon`.

**AI hints:**

- **An action with a consequence never takes an icon alone.** Delete, approve, publish,
  export: add text.
- **When in doubt about size, `size=sm`.** It is the one that goes with body text and fits in
  any control.
- **Do not look for a color property** — it does not exist. If you want to change the icon
  color, change the color of the context.
- **An icon next to text is decorative:** leave `label` empty.
- **An icon alone inside a control:** the accessible label goes **on the control**, not on the
  icon.
- **`size` is mandatory and has no default.** Forgetting it means an icon that does not appear.
- **If the icon you need is not in the core: flag the gap, do not draw.**

## Examples

**Recommended case:** `magnifying-glass` in a search action, with the accessible label on the
control and the icon decorative.

**Alternative case:** `circle-notch` as the artwork of `nph-spinner` — the same core serving
another component, instead of new artwork.

## Anti-patterns

- **Do not use to:** communicate a destructive or domain action on its own.
- **Do not combine with:** a forbidden family, Duotone outside structural navigation, an icon
  outside the core.
- **Invalid combinations, and why:** `size` absent — there is no default, and the icon does not
  render · Duotone in a button, field, feedback, alert, table or destructive action —
  forbidden by the foundation.
- **Do not create or adapt without a decision:** artwork, name, variant, color token, free
  size or any license configuration.

## Sources and decisions

### Implementation status — evidence verified on 31-08-2026

| What | Evidence |
|---|---|
| Implemented and integrated | It is on the default branch `v/3.0.0`, through **PR #6**, merge `437dd60`, on 27-08-2026 |
| The code API | `name`, `variant`, `size` and `label` — **exactly the contract of this spec**, checked property by property in `src/components/nph-icon/nph-icon.ts` |
| The core in the code | `NPH_ICON_NAMES` is the current list of names, all with `regular` and `solid` |
| `size` reflects in the DOM | Confirmed in the code, with the reason written there: the internal CSS selects the box by it |
| Invalid input error | Confirmed: only in a development environment |
| Stories | In `nph-icon.stories.ts` |
| Tests | Declared in `nph-icon.test.ts` |
| Visual approval | Figma documentation approved on **14-09-2026**, in the `Documentação — nph-icon` (Documentation — nph-icon) frame (`346:4`) |

> **A divergence I found, and how I resolved it.** The old spec at
> `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-icon.md` says the remaining gate is
> `comparar Figma × Storybook e registrar o aceite` (compare Figma × Storybook and record the acceptance). **The `Estado vigente — Nephos` (Current status — Nephos) (vault)
> records that the comparison was made and accepted by Indiane on 26-08-2026.** The Status is
> the single source of status, and it is the one that counts — the old spec fell behind and is memory.

| What | Where |
|---|---|
| Technical contract | `design.md`, in the repository |
| The decision that originated it | **P21**, with Lit, open Shadow DOM, inline SVG, a closed map of the core icons and Font Awesome Pro 6.7.2 |
| Decisions after the technical plan | `size` mandatory · invalid input error only in development · `space/inline-tight` belongs to the container · whitespace-only `label` is decorative · `eye`, `eye-slash` and `star` may overflow |
| Tests | `src/components/nph-icon/nph-icon.test.ts` |
| Storybook | `src/components/nph-icon/nph-icon.stories.ts` |
| Figma | page `NPH — Icon` (`346:2`), frame `nph-icon` (`1130:956`) and `Raiz — nph-icon` (Root — nph-icon) (`1138:1694`) |
| Collection, family, size and color rules | `Fundação — ícones` (Foundation — icons) (vault) |
| The origin spec, now memory | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-icon.md` |
| What is open | `Pendências do Nephos` (Nephos open items) (vault) — **PF-08** and **PO-001** |

**License.** **PE-04 is closed**. No credential is versioned; the local configuration
stays outside Git and must not be read, exposed, added or versioned.

---

*Provenance: function, variants, states, accessibility, relations, examples and
anti-patterns are **evidence** — they come from the origin spec, rewritten in the nine-section
template, without any rule change. The `api` block and the implementation status table are
**evidence verified in the repository** on 31-08-2026, property by property. The
AI hints are **new**, distilled from criteria already written. P21 and the later
decisions are a **human decision** by Indiane, on 26-08-2026. PF-08 is an **open item**.
No change was made to code, tokens, tests, Figma or repository.*
