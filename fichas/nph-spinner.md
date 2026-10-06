---
piece: nph-spinner
level: component
status: active
solves: >-
  Shows that the system is working when the wait has no set time to
  end, without being the only sign that something is happening.
use_when:
  - "Saving a form, fetching data or waiting for a button's response, with status text beside it."
  - "The wait is short and the person needs to see that the click worked."
do_not_use_when:
  - "The progress is known — show the progress in text or percentage; the spinner does not fit."
  - "The spinner would be the only sign of waiting — write beside it what is happening or give it a label."
  - "The piece would need to receive click or focus — the target is the surrounding control."
api:
  size:
    type: enum
    values: [sm, md]
    required: false
    default: sm
    reflects: true
    constraint: >-
      Reflects because the internal CSS selects the drawing by it. sm inside a
      button or field; md in a content area, card or highlighted block. lg does
      not exist. A value outside the list draws nothing and emits console.error in
      development.
  label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      Accessible name of the spinner when there is no status text beside it. Empty or
      whitespace-only makes the spinner decorative, out of the accessibility tree.
variants:
  size:
    axis: size
    choose_when: "sm inside a button or field; md in a content area, card or highlighted block."
    do_not_combine_with: [lg, type]
states:
  spinning:
    token: motion/loop-duration
    changes_for_user: "The circle-notch spins continuously while the wait lasts."
  reduced-motion:
    token: not_applicable
    changes_for_user: "With reduced motion requested by the system, the spin stops and the notice continues through the text or the label."
business_rules:
  - "The spinner is never the only sign of waiting: there is status text beside it or a label."
  - "The color inherits from the context; the spinner has no color property."
domain_errors: []
tokens:
  size: [icon/size-sm, icon/size-md]
  duration: motion/loop-duration
  easing: motion/loop-easing
  standalone_color: color/foreground
ai_hints:
  - "Use nph-spinner when the wait has no set time to end; with known progress, show the progress."
  - "Always put status text beside it, such as Saving…; without text, fill in label."
  - "Use size sm inside a button or field and md in a content area."
  - "The artwork is the circle-notch of nph-icon; do not use the classic spinner, which spins in steps."
accessibility:
  semantics: "With label, the host is `role=img` with `aria-label`. Without label, the host is `aria-hidden` and the text beside it gives the notice."
  accessible_name: "The label, when there is no status text beside it."
  keyboard: []
  focus: "The spinner does not receive focus; the surrounding control does."
  contrast: "Standalone, it uses color/foreground, above 3:1 in both schemes; inside a control, the pair of the control's text applies."
  color_alternative: "The notice comes from the status text or the label; color carries no meaning."
invalid_combinations:
  - "size lg — it does not exist; the largest size is md."
  - "Property type, including the old Type=Mirrored of the kit — it was removed."
  - "Spinner without text beside it and without label — it becomes the only sign of waiting."
  - "Spinner for known progress — show the progress."
relations:
  combines_with: [nph-icon, nph-button]
  parents: [nph-button]
  children: [nph-icon]
  complements_block: []
  appears_in: []
anti_patterns:
  - "Using the spinner as the only sign of waiting."
  - "Stretching, rotating by hand or recoloring the spinner."
  - "Swapping the circle-notch artwork for another icon, including the classic spinner."
  - "Keeping the spin when the system asks for reduced motion."
sources:
  design_md: "design.md, motion/loop-duration, motion/loop-easing, icon/size-sm, icon/size-md and the circle-notch in `icones_nucleo`"
  decision: "P66 — API and semantics of nph-spinner, nph-separator and nph-kbd, 05-10-2026"
  tests: "src/components/nph-spinner/nph-spinner.test.ts"
  usage_evidence: "nph-button, in the `carregando` state, planned in Batch B"
  storybook: "src/components/nph-spinner/nph-spinner.stories.ts"
  figma: "DS-IA-NEPHOS 5.0, nph-spinner frame 1195:22210 and set 281:11"
---

# nph-spinner

## Function

**The problem it solves:** shows that the system is working when the wait
has no set time to end, without being the only sign that something is happening.

**When to use:**

- When saving a form, fetching data or waiting for a button's response, with
  status text beside it, such as "Saving…".
- When the wait is short and the person needs to see that the click worked.

**When NOT to use:**

- **Known progress** — show the progress in text or percentage.
- **As the only sign of waiting** — write beside it what is happening or give it a
  `label`.
- **As a click or focus target** — the target is the surrounding control.

## Variants

| Variant | Values | Choose when |
|---|---|---|
| `size` | `sm` (default), `md` | `sm` inside a button or field; `md` in a content area, card or highlighted block |

**By appearance and density:** `not_applicable`.

**Do not combine with:** `lg`, which does not exist, nor `type`, including the old
`Type=Mirrored` of the kit, which was removed. Do not create a new size.

## States

| State | Token | What changes for the person |
|---|---|---|
| Spinning | `motion/loop-duration` and `motion/loop-easing` | The `circle-notch` spins continuously while the wait lasts |
| Reduced motion | `not_applicable` | The spin stops, and the notice continues through the text or the `label` |

**Feedback and focus:** the spinner does not receive click or focus. Focus belongs to the
surrounding control.

**Business rule the piece carries:** the spinner is never the only sign of waiting.
The color inherits from the context: standalone, it resolves to `color/foreground`; inside a control,
it follows the color of the control's text.

**Domain error states:** none.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | With `label`, the host is `role="img"` with `aria-label`. Without `label`, the host is `aria-hidden` |
| Accessible name | The `label`, when there is no status text beside it. With text beside it, the spinner is decorative, so the screen reader does not read twice |
| Keyboard and focus | The spinner does not receive focus |
| Motion | With `prefers-reduced-motion: reduce`, the spin stops (WCAG 2.3.3). Reducing motion is not removing the notice |
| Contrast | Standalone, `color/foreground` stays above 3:1 in both schemes; inside a control, the pair of the control's text applies |
| Alternative to color | The notice comes from the text or the `label` |

## Relations

**Combines with:** `nph-icon` and `nph-button`.

**What is the parent:** `nph-button`, in the loading state.

**What is the child:** `nph-icon`, with the `circle-notch` in the same `size`.

**Which block this piece complements:** none.

**Appears in layouts:** none.

## Tokens, intent and AI hints

| Part | Token |
|---|---|
| Size | `icon/size-sm` and `icon/size-md`, through `nph-icon` |
| Turn duration | `motion/loop-duration` |
| Curve | `motion/loop-easing` |
| Color, standalone | `color/foreground`, by inheritance |

**Usage restrictions:** the color always comes from the context. The artwork is always the
`circle-notch` of `nph-icon`, made for continuous rotation.

**AI hints:**

- Use `nph-spinner` when the wait has no set time to end; with known
  progress, show the progress.
- Always put status text beside it, such as "Saving…"; without text, fill in
  `label`.
- Use `size="sm"` inside a button or field and `size="md"` in a content area.
- The artwork is the `circle-notch`; do not use the classic `spinner`, which spins in steps.

## Examples

**Recommended case:** when saving a form, `nph-spinner` in `sm` beside the
text "Saving…", decorative.

**Alternative case:** when loading a content area without visible text,
`nph-spinner` in `md` with `label` "Loading results".

## Anti-patterns

- **Do not use as the only sign of waiting** — give text beside it or a `label`.
- **Do not stretch, rotate by hand or recolor** — size and color come from the tokens and the
  context.
- **Do not swap the artwork** — the drawing is the `circle-notch` of `nph-icon`.
- **Do not keep the spin with reduced motion** — the spin stops and the notice continues.
- **Do not use with known progress** — show the progress.

## Sources and decisions

- **The repository `design.md`:** `motion/loop-duration`, `motion/loop-easing`,
  `icon/size-sm`, `icon/size-md` and the `circle-notch` in the icon core.
- **The decision that originated it:** P66, of 05-10-2026.
- **Tests:** `src/components/nph-spinner/nph-spinner.test.ts`.
- **Usage evidence:** `nph-button`, in the loading state, planned in Batch B.
- **Storybook:** `src/components/nph-spinner/nph-spinner.stories.ts`.
- **Figma:** `nph-spinner` frame (`1195:22210`) and set `281:11` in
  `DS-IA-NEPHOS 5.0`.
