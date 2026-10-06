---
piece: nph-label
level: component
status: active
title: "nph-label"
type: component spec
created: 2026-08-31
updated: 2026-10-06
solves: >-
  Names a form control in a visible and accessible way. The label is
  only text, and it carries no layout, text state or error message. It carries the trigger
  of the help, not the help: the information icon opens the nph-tooltip.
use_when:
  - "A form control needs a visible name, on its own or inside an nph-field."
do_not_use_when:
  - "It is a sentence with a verb and a full stop — that is `text/body-md`."
  - "It opens a section or group — that is `text/heading-sm`."
  - "It is emphasis inside a paragraph — that is `<strong>`."

api:
  text:
    type: string
    required: true
    default: "empty"
    reflects: false
    constraint: >-
      Carries the label content, already localized by the consuming application.
      It exists as a property because, without Shadow DOM, there is no `slot`.
  required:
    type: boolean
    required: false
    default: false
    reflects: true
    constraint: >-
      Adds the asterisk at the end of the text. The asterisk is decorative
      (`aria-hidden`): the requiredness must be communicated by the control.
  for:
    type: string
    required: false
    default: unset
    reflects: true
    constraint: >-
      `id` of the control this label names. It mirrors the native attribute and is the
      association mechanism — the reason the component does not use Shadow DOM.
  info:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The text of the explanation, already localized by the consuming application. With
      info-label, it shows the information icon after the text, which opens the
      nph-tooltip with this text. Without info-label, the icon does not appear and
      console.error is emitted in development; the label remains.
  info-label:
    type: string
    required: false
    default: "empty"
    reflects: false
    constraint: >-
      The accessible name of the information icon. The property is infoLabel. Without
      info, nothing appears and there is no error.
  slots: none
  events: none
  color: >-
    It is not a property. The text is `color/foreground` and the asterisk is
    `status/error`, always — including when the field is in error.

variants:
  required:
    axis: appearance
    choose_when: "true when filling in the field is required"
    do_not_combine_with: ["layout", "weight"]
  info:
    axis: appearance
    choose_when: "When the field needs a short explanation that does not fit in the label; in code, it is the text of info with info-label."
    do_not_combine_with: ["layout", "weight"]

states:
  default:
    token: not_applicable
    changes_for_user: "The text has no state. Error and disabled are shown by the field and by the composition"
  focus:
    token: "border border/width in focus/border and halo focus/ring-width in focus/halo, around the 24 by 24 target"
    changes_for_user: "Only on the information icon and only from the keyboard: the border and the halo mark the focus, without changing the size."
  open:
    token: "the nph-tooltip, below the label, at space/inline"
    changes_for_user: "The balloon shows the explanation; it closes with Esc, click outside or Tab out. Hovering does not open it."

business_rules:
  - "A required field is signaled by the asterisk — and the actual requiredness belongs to the control"
domain_errors: []

tokens:
  text: [text/label-md]
  text_color: color/foreground
  asterisk_color: status/error
  asterisk_gap: space/inline-tight
  trigger_gap: space/inline-tight
  trigger: [icon/size-sm, space/inline-tight, color/muted-foreground]
  trigger_focus: [border/width, focus/border-radius-control, focus/ring-width, focus/radius-control-with-border, focus/border, focus/halo]
  tooltip_gap: space/inline

ai_hints:
  - "A field label is `nph-label`; a sentence with a verb and a full stop is not."
  - "The label does not change on error. The field and the message change."
  - "Do not look for a layout property: the position belongs to `nph-field`."
  - "`required=true` alone does not communicate requiredness to a screen reader."
  - "The information icon appears with info and info-label together; info-label is the name the screen reader announces."

accessibility:
  semantics: "Native `<label>` element; the information icon is a native `<button>` after it, outside the `<label>`, with aria-expanded and aria-controls pointing to the nph-tooltip"
  accessible_name: "The label is the source of the accessible name of the control. The information icon is named by info-label"
  keyboard:
    - "Tab enters and leaves the information icon; the text does not receive focus."
    - "Enter and Space open and close the balloon."
    - "Esc closes the open balloon, and focus stays on the icon."
  focus: "The text does not receive focus. The information icon does, with border focus/border and halo focus/halo outside, only from the keyboard"
  contrast: "Measured in both modes: the text and the asterisk pass at 4.5:1; the icon, in color/muted-foreground, 6.69:1 and 9.81:1; the focus border, in focus/border, 3.68:1 and 8.98:1"
  color_alternative: "The asterisk is a shape signal, not a color one — and it is decorative"

invalid_combinations:
  - "`required=true` without a visible legend explaining the convention in the form"
  - "Creating a layout or weight property — both were refused by decision; the text also has no state"
  - "info without info-label — the icon does not appear, because it would have no accessible name"

relations:
  combines_with: [nph-input, nph-field, nph-checkbox]
  parents: [nph-field]
  children: [nph-icon, nph-tooltip]
  complements_block: [pending]
  appears_in: [pending]

anti_patterns:
  - "Changing the label color when the field enters error"
  - "Using `nph-label` to open a section or give emphasis"
  - "Treating the asterisk as the requiredness signal for assistive technology"

sources:
  design_md: "design.md, in the repository"
  decision: "P62.1, P62.2 and P62.3, approved by Elvys on 28-08-2026; P62.6, the information trigger, under review in the PR by maurocsjr"
  tests: "src/components/nph-label/nph-label.test.ts"
  usage_evidence: "branch v/3.0.0, PR #10, merge e231eba"
  storybook: "src/components/nph-label/nph-label.stories.ts"
  figma: "page NPH — Label, nph-label frame 1194:1482 and master set 374:6"
tags: [nephos, ds-agentico, ficha, componente, nph-label]
---

> **References marked `(vault)`** are in `02 PROJETOS/DS-Agentico/`, in the WORK BRAIN —
> outside this repository. They were Obsidian wikilinks and were converted into an
> explicit reference in the migration of 31-08-2026.

# nph-label

> **The principle that governs this piece, approved by Indiane on 27-08-2026: the label is
> only text.** It carries no layout, text state or error message. Since 08-09-2026 (L8),
> it carries the **trigger** of the help, not the help: the information icon opens the
> `nph-tooltip`.
>
> The API is in the YAML block above. Back to `Índice — DS-Agentico` (Index — DS-Agentico) (vault).

## Function

**The problem it solves:** names a form control in a visible and
accessible way.

**When to use:** whenever a form control needs a visible name —
on its own or inside an `nph-field`.

**When NOT to use:**

- **A sentence with a verb and a full stop** — that is `text/body-md`.
- **Opening a section or group** — that is `text/heading-sm`.
- **Giving emphasis inside a paragraph** — that is `<strong>`, not a label.

## Variants

**By appearance — `required` and `info`:** each one `false` or `true`, alone or together
(master set `374:6`). `required` adds the asterisk; `info` adds the information icon
after the text. In code, `info` is the text of the explanation and only draws the
icon with `info-label`.

**By size and by density:** `not_applicable`. The label has a single text role.

**Do not combine with:** `layout` and `weight`. **Both were refused by a recorded
decision** on 27-08-2026 — layout belongs to `nph-field` and weight belongs to the typography foundation.
The text also has no state; the Figma `state` axis (`default` and `focus`) exists only
with `info` and is the focus of the icon (L9).

## States

**The text has no state of its own**, and this is a decision, not an omission. The only states
belong to the information icon: **focus**, from the keyboard, and **open**, with the balloon.

| The situation | Where it appears |
|---|---|
| **Error** | **The label does not change.** It stays in `color/foreground`. The error stays in the field and in the message |
| **Disabled** | It does not belong to the label. `nph-field` applies `state/disabled-opacity` to the whole control |
| **Help and error message** | They belong to `nph-field`. The label carries the text, the asterisk and the trigger of the help, not the help (L8) |

**What changes for the person:** nothing, in the text. On the information icon, the focus and the open
balloon.

**Feedback and focus:** the label text **is not focusable**. Activating the label moves focus
to the associated control — native `<label>` behavior, which only works because of
the decision not to use Shadow DOM. The information icon is focusable: with focus, it shows the
`focus/border` border and the `focus/halo` halo around the 24 × 24 target. Activated by
click, Enter or Space, it opens the `nph-tooltip` below the label, at `space/inline`; it closes
with Esc, click outside or Tab out. Closing by Tab is the keyboard reading
of the "click outside" of L11, confirmed by Indiane on 06-10-2026 (P62.6). Hovering
does not open it.

**Business rule the piece carries:** the asterisk signals a required field. **But the
asterisk is decorative** — see Accessibility.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Native `<label>` element. The information icon is a native `<button>` after it, outside the `<label>`, with `aria-expanded` and `aria-controls` |
| Association | Through the `for` attribute, pointing to the `id` of the control |
| Accessible name | **The label is the source of the accessible name of the control.** When there is an associated visible label, the control does **not** receive a duplicate name through `aria-label` |
| Keyboard and focus | The text does not receive focus. The information icon enters the Tab order; Enter and Space open and close the balloon; Esc closes it. The balloon is a `role="status"` live region and does not receive focus |
| Icon name | `info-label`. Without it, the icon does not appear |
| Touch target | The information icon has a 24 × 24 target, with the 16 px artwork in the center (WCAG 2.5.8) |
| Contrast | In both modes. Text and asterisk, measured on 27-08-2026, pass the minimum of 4.5:1. The icon, in `color/muted-foreground`, measured on 08-09-2026 (L8): 6.69:1 and 9.81:1. The focus border, in `focus/border`, measured on 01-10-2026 (frame `1194:1482`): 3.68:1 and 8.98:1 |
| Alternative to color | The asterisk is a **shape signal, not a color one** |

> ⚠️ **The asterisk does not communicate requiredness to a screen reader.** In the code it is output
> with `aria-hidden` — it is decorative. Two consequences, and both are mandatory:
>
> 1. **Requiredness must be communicated in code** to the control, for assistive
>    technology. `required=true` on the label **does not do this**.
> 2. **Every form that uses `required=true` needs a visible legend** explaining
>    the asterisk convention. The symbol is a visual signal, not a substitute.

## Relations

**Combines with:** `nph-input`, `nph-field` and `nph-checkbox`.

**What is the parent:** `nph-field`, which composes label, control and message — and it is the one that
decides the **position** of the label relative to the control.

**What is the child:** with the trigger, `nph-icon` (`circle-info`) and `nph-tooltip`, which
shows the explanation. Without the trigger, `nph-label` is a leaf.

**Which block it complements:** `pending` — Phase 5 has not started.

**Appears in layouts:** `pending`, for the same reason.

**The boundary, in writing:** help and error message **do not belong to the label**. If you are
thinking of adding either of them here, the place is `nph-field`.

## Tokens, intent and AI hints

**Semantic tokens used** — checked in the component CSS on 31-08-2026; the
trigger, on 06-10-2026:

| Part | Token |
|---|---|
| The text | `text/label-md`, in all the properties of the role |
| The text color | `color/foreground` |
| The asterisk color | `status/error` |
| The space before the asterisk | `space/inline-tight` |
| The space up to the information icon | `space/inline-tight` |
| The information icon | `circle-info` `solid` in `icon/size-sm`, with `space/inline-tight` around it (24 × 24 target), in `color/muted-foreground` |
| The icon focus | `border/width` in `focus/border`, radius `focus/border-radius-control`; halo `focus/ring-width` in `focus/halo`, radius `focus/radius-control-with-border` |
| The space up to the balloon | `space/inline` |

**This piece is the first proof in code of P62.2** — the text roles, each one with
its properties. Without them, the label would only exist with a literal value.

**Usage restrictions:** the `use` of `status/error` was **extended in `design.md` before the
code**, to cover the asterisk. The label color **does not change** in any situation. The
limits of the trigger are in P62.6: the `use` of `color/muted-foreground` comes to mention the
icon through PR #57, by Indiane's decision of 06-10-2026 (L-a); rule 6 of `design.md` comes to admit border and halo through PR #57 (L-b); and the
balloon has no `z-index`, because there is no layer token (L-c).

**AI hints:**

- **A field label is `nph-label`.** A sentence with a verb and a full stop is not — it is `body-md`.
- **The label does not change on error.** The field and the message change. If you are
  looking for how to make the label red, the answer is: you don't.
- **Do not look for a layout property.** The label position belongs to `nph-field`.
- **`required=true` alone does not communicate requiredness** to a screen reader. The control
  must say so in code, and the form needs a visible legend.
- **`text` is a property, not content between the tags.** Without Shadow DOM there is no `slot`.
- **The information icon is `info` plus `info-label`.** Without the name, the icon does not appear. The
  text of the explanation goes in the balloon, not in the label.

## Examples

**Recommended case:** `nph-label` with `text` and `for` pointing to the `id` of `nph-input`,
inside an `nph-field` — the label names, the field composes.

**Alternative case:** `required=true` in a form that already has the visible legend
explaining the asterisk, with the requiredness also declared on the control.

**With an explanation:** `info` with the short text of what the field asks for and `info-label` with the
name of the icon, such as `Sobre CPF` (About CPF).

## Anti-patterns

- **Do not use to:** open a section, give emphasis, or write running text.
- **Do not combine with:** a layout or weight property — both were refused by
  decision.
- **Invalid combinations, and why:** `required=true` without a visible legend in the form
  — the asterisk alone does not explain the convention · changing the label color on error — the
  decision is that it does not change · expecting the asterisk to announce requiredness to a screen
  reader — it is `aria-hidden` · `info` without `info-label` — the icon would have no name.
- **Do not create or adapt without a decision:** a new variant, an own color token, or
  any property beyond those in the `api` block.

## Sources and decisions

### Implementation status — evidence verified on 31-08-2026; the trigger, on 06-10-2026

| What | Evidence |
|---|---|
| Implemented and integrated | It is on the default branch `v/3.0.0`, through **PR #10**, merge `e231eba`, on 28-08-2026. **It is the second component available on the default branch** |
| The code API | `text`, `required` and `for` — **it is P62.3**, checked property by property in `src/components/nph-label/nph-label.ts`. `info` and `info-label` come in through **P62.6** (DSA-04), under review |
| `required` and `for` reflect in the DOM | Confirmed in the code |
| No Shadow DOM | Confirmed, with the reason written in the file itself |
| Tokens consumed | Checked in `nph-label.css`: `text/label-md` (the properties of the role), `color/foreground`, `status/error`, `space/inline-tight`; with the trigger, those of the `tokens` block |
| Stories and tests | In `nph-label.stories.ts` and `nph-label.test.ts` |
| Visual approval | Indiane, on **27-08-2026**, master set `374:6` on the `NPH — Label` page, in light and dark modes; on **08-09-2026**, the `required` × `info` matrix (L8); on **01-10-2026**, the icon focus and frame `1194:1482` (L9 and L10) |

> **Two divergences I found in the old spec, and how I resolved them.**
>
> The spec at `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-label.md` says that
> **`a forma de associação é pendente`** (the association form is pending) and that
> **`o componente não está na v/3.0.0`** (the component is not on `v/3.0.0`). Both
> fell behind: the association is `for`, closed by **P62.3**, and the component
> was merged on 28-08-2026. It also records the two technical decisions as
> `pendentes de confirmação de Elvys` (pending confirmation by Elvys) — **P62.1 and P62.3 were approved by him on
> 28-08-2026**. The status source is the `Estado vigente — Nephos` (Current status — Nephos) (vault), confirmed in the
> repository; the old spec is memory.

### The exception this piece carries

**`nph-label` is the only Nephos component without Shadow DOM.** It is **P62.1**, a declared
exception to P01, **for a single piece, without setting a precedent**.

**The reason, and it matters:** the native association between label and control **does not cross
the Shadow DOM boundary**. Without it, `for` would not reach the `id` of the control, a
click on the label would not move focus, and **the label would lose its function**. The exception exists
to preserve native browser behavior, not for implementation convenience.

And it required two more properties than planned: **`for`**, the association
mechanism, and **`text`**, which carries the content — because without Shadow DOM there is no
`slot`.

**Do not imitate this exception in another component.** It applies to this piece, for this reason.

### The decisions of 27-08-2026

| # | Subject | The decision |
|---|---|---|
| — | Scope | Enters v1 as the **2nd item of the P0 cut** (21-08-2026) |
| 1 | Error | **The label does not change** |
| 2 | Layout | **It does not belong to the label** — it belongs to `nph-field` |
| 3 | Required | **Asterisk**, in the format `Nome completo *` (Full name *) |
| 4 | Disabled | **It has no state of its own** |
| 5 | Boundary with `nph-field` | **Help and error message belong to `nph-field`** — partly superseded by L8: the label carries the trigger of the help |

| What | Where |
|---|---|
| Technical contract | `design.md`, in the repository |
| The technical decisions | `docs/decisoes-tecnicas.md` — P62.1, P62.2, P62.3 and P62.6 |
| Text role rules | `Fundação — tipografia` (Foundation — typography) (vault) |
| Text and state color rules | `Fundação — cor` (Foundation — color) (vault) |
| The origin spec, now memory | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-label.md` |
| What is open | `Pendências do Nephos` (Nephos open items) (vault) |

---

*Provenance: function, variants, states, accessibility, relations, examples,
anti-patterns and the decisions of 27-08-2026 are **evidence** — they come from the origin spec,
rewritten in the nine-section template, without any rule change. The `api` block, the tokens
consumed, the absence of Shadow DOM and the implementation status are **evidence
verified in the repository** on 31-08-2026. The AI hints are **new**. P62.1,
P62.2 and P62.3 are a **human decision** by Indiane, approved by Elvys on 28-08-2026.
On 06-10-2026, the spec gained the information trigger (DSA-04): the anatomy and the
behavior come from L8 to L11 and from frame `1194:1482`, accepted by Indiane; the API and the
semantics are **P62.6**, under review in the PR by `maurocsjr`.*
