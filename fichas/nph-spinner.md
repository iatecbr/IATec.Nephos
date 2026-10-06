---
peca: nph-spinner
nivel: componente
status: "incomplete — awaiting implementation"
titulo: "nph-spinner"
tipo: component spec
criado: 2026-08-31
atualizado: 2026-08-31
resolve: >-
  Makes loading perceptible while an action or content area has not
  finished yet — without being the only sign that something is happening.
use_quando:
  - "A content area is loading."
  - "A button or field needs to indicate processing in progress."
nao_use_quando:
  - "The spinner would be the only sign that something is happening."
  - "The context requires a touch action — the spinner is not a control."

api:
  origem: >-
    PROPOSAL — there is no code to check. The two implemented specs
    (`nph-icon` and `nph-label`) have the API checked property by property
    in the repository; this one does NOT. Read it as approved intent, not as a
    verified contract.
  size:
    tipo: enum
    valores: [sm, md]
    obrigatoria: true
    padrao: nenhum
    reflete: "to be defined in the implementation"
    restricao: >-
      `sm` inside a button and a field; `md` in a content area. `lg` does not exist and
      is not created. The old `type=Mirrored`, inherited from the kit, was removed.
  label:
    tipo: string
    obrigatoria: false
    padrao: "to be defined in the implementation"
    reflete: "to be defined in the implementation"
    restricao: >-
      Without adjacent loading text, the spinner needs an accessible name.
      With text beside it, it is decorative. The exact form belongs to the technical plan.
  slots: "to be defined in the implementation"
  eventos: "to be defined in the implementation"
  cor: >-
    It is not a property. It inherits `currentColor` from the context, like every icon.

variantes:
  size:
    eixo: tamanho
    escolha_quando: "by the usage context, never by visual preference"
    nao_combine_com: ["lg", "type", "Type=Mirrored"]

estados:
  carregando:
    token: "pending — PF-05 and PF-16"
    muda_para_a_pessoa: "The `circle-notch` spins continuously while the operation is in progress"

regras_de_negocio: []
erros_de_dominio: []

tokens:
  tamanho: [icon/size-sm, icon/size-md]
  arte: circle-notch
  cor: currentColor
  movimento: "pending — see PF-05 and PF-16"

dicas_para_ia:
  - "A spinner is never the only sign: it needs text or context that says what is happening."
  - "Inside a button or field it is `sm`; a content area is `md`. There is no `lg`."
  - "Do not invent duration, repetition or curve: the two motion decisions are open."
  - "The artwork is `circle-notch`. Do not use the classic `spinner`."

acessibilidade:
  semantica: "Progress indicator; decorative when there is adjacent loading text"
  nome_acessivel: "Without adjacent text, an accessible name is required; with text, hide it from assistive technologies"
  teclado: []
  foco: "It does not receive focus and is not a touch target"
  contraste: "pending — depends on the organization's WCAG level (PI-05)"
  alternativa_a_cor: "The textual context communicates the loading; the spinner alone is not enough"

combinacoes_invalidas:
  - "Spinner as the only sign of processing"
  - "Creating duration, repetition or motion token without a technical decision"
  - "`size=lg` or any `type`"

relacoes:
  combina_com: [nph-icon, nph-button]
  pai: [nph-button, "the content area being loaded"]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Using the classic `spinner` instead of `circle-notch`"
  - "Exposing `Type=Mirrored` or an `lg` variant"
  - "Implementing motion by inference"

fontes:
  design_md: "design.md — icon and size rules; motion pending"
  decisao: "`Registro de decisões e status — Componentes Nephos`"
  testes: "does not exist — no implementation"
  evidencia_de_uso: "does not exist — no implementation"
  storybook: "does not exist — no implementation"
  figma: "page `NPH — Spinner`, visually approved"
tags: [nephos, ds-agentico, ficha, componente, nph-spinner, incompleta]
---

> **References marked `(vault)`** are in `02 PROJETOS/DS-Agentico/`, in the WORK BRAIN —
> outside this repository. They were Obsidian wikilinks and were converted into an
> explicit reference in the migration of 31-08-2026.

# nph-spinner

> ⚠️ **This spec is incomplete, on purpose.** The component **has not been
> implemented**: there is no code, Storybook or tests. What exists is the visual
> approval, the defined artwork and the scope decisions — and that is what is here.
>
> **The `api` block is a proposal, not a verified contract.** In the specs of `nph-icon` and
> `nph-label` I checked the API in the repository, property by property. Here there is
> nothing to check. Do not read this API with the same confidence.
>
> **The spec is only completed at the component's closing**, with verifiable
> implementation, Figma × Storybook comparison, evidence and acceptance. Until then, the
> `api` block remains a proposal — Indiane's decision on 31-08-2026. Back to
> `Índice — DS-Agentico` (vault).

## Function

**The problem it solves:** makes loading **perceptible** while an action or
content area has not finished yet.

**When to use:** `sm` inside a button or field; `md` in a content area that is loading.

**When NOT to use:**

- **As the only progress message.** A spinner alone does not say what is happening,
  nor how much is left.
- **As a control.** It does not receive touch or click — it is not a button.

## Variants

**By size — `size`:** `sm` and `md`. **The choice is by the usage context, never by
visual preference:** inside a button and a field it is `sm`; a content area is `md`.

**By appearance and by density:** `nao_se_aplica`.

**Do not combine with:** `lg` — **it does not exist and is not created** — and `type`, including the old
`Type=Mirrored`, inherited from the Obra kit and **removed by decision**.

## States

**Supported state: loading.** It is the only one.

**What changes for the person:** the `circle-notch` **spins continuously** while the operation
is in progress.

**Which token this state uses: `pendente`.** And this is the gap that keeps the spec from
closing:

| What is missing | Where it is recorded |
|---|---|
| **The loop duration** — it sits above the scale and has no defined value | **PF-05** |
| **The `linear` curve** — `design.md` declares `core/easing/linear`, and it **does not exist** in the token source or in the generated CSS | **PF-16** |

**Without both, the spinner does not spin.** See `Pendências do Nephos` (vault).

**Feedback and focus:** it does not receive focus and is not a touch target.

> **Do not implement the motion by inference.** Duration, repetition and curve are an open
> technical decision. Choosing a plausible value here is exactly the failure mode that
> this documentation exists to prevent.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Progress indicator. **Decorative when there is adjacent loading text** |
| Without adjacent text | **Accessible name required** |
| With text beside it | Hide the spinner from assistive technologies — otherwise the information is announced twice |
| Keyboard and focus | It does not receive focus, it is not a touch target |
| Contrast | `pendente` — depends on the organization's WCAG level (**PI-05**) |
| Alternative to color | **The textual context communicates the loading.** The spinner is not a sufficient sign on its own |

**Reduced motion.** The motion foundation is explicit: with reduced motion, the
spin **stops** — it becomes a static indicator or determinate progress. This **is not removing the
feedback**: whoever asked for reduction still needs to know that something is happening, and it is
the text that carries that information. See `Fundação — movimento` (vault).

## Relations

**Combines with:** `nph-icon` — from which it inherits the artwork — and `nph-button`.

**What is parent:** the `nph-button` while processing, and the content area being loaded.

**What is child:** nothing. The spinner is a leaf.

**Which block it complements:** `pendente` — Phase 5 has not started.

**Appears in the layouts:** `pendente`, for the same reason.

**The dependency that orders the queue:** `nph-spinner` comes **after** `nph-icon`, because
its artwork is the core's `circle-notch`. And it is **preparation before P0**: the button's
loading state depends on it.

## Tokens, intent and AI hints

**Semantic tokens used:** `icon/size-sm` and `icon/size-md`.

**The artwork:** `circle-notch` — a ring with a cut, made for **continuous rotation**. The
classic `spinner` was discarded because it is drawn to spin in **eight discrete
steps**, and not to spin smoothly.

**The color:** inherits `currentColor`. There is no spinner color token.

**The motion:** `pendente`. See States.

**Usage restrictions:** do not use a literal value, do not consume `core/*` directly, do not
use alternative artwork.

**AI hints:**

- **A spinner is never the only sign.** It needs text or context that says what is
  happening.
- **Inside a button or field it is `sm`; a content area is `md`.** There is no `lg`.
- **Do not invent duration, repetition or curve.** The two motion decisions are
  open — PF-05 and PF-16.
- **The artwork is `circle-notch`**, not the classic `spinner`.
- **With reduced motion, the spin stops.** The feedback becomes the text.

## Examples

**Recommended case:** an `sm` spinner inside an action being processed, with an accessible
name and with the button text saying what is happening.

**Alternative case:** an `md` spinner in a content area, accompanied by a loading
message — and then the spinner is decorative.

## Anti-patterns

- **Do not use for:** signaling on its own that an operation is underway.
- **Do not combine with:** an unapproved size, a type inherited from the Obra kit, or artwork other
  than `circle-notch`.
- **Invalid combinations, and why:** `size=lg` — does not exist · any `type` — the
  property was removed · spinner without context text — the loading is silent
  for those who do not see the animation.
- **Do not create or adapt without a decision:** duration, repetition, motion token or the technical
  API.

## Sources and decisions

### What exists today — 31-08-2026

| What | Status |
|---|---|
| Visual approval | **Approved**, on the `NPH — Spinner` page, with `size=sm\|md` |
| Implementation | **Does not exist.** No code, no stories, no tests |
| Artwork | `circle-notch`, from the icon core |
| Scope | **In v1**, as **preparation before P0** — it is not part of the P0 cut and does not reorder it |
| Motion | **Open** — PF-05 and PF-16 |

### What is missing for this spec to close

1. **The motion decision** — loop duration and the curve. Without it the component cannot
   be implemented without inventing a value.
2. **The implementation**, and with it: the API checked in the code, Storybook and the tests.
3. **The WCAG level** (PI-05), so the contrast criterion can be accepted.

**Once a verifiable implementation exists, the spec is only updated at the
closing**, after Figma × Storybook comparison, evidence and acceptance. Only then
does the `api` block stop being a proposal and become checked property by
property, as in the implemented specs.

| What | Where |
|---|---|
| Technical contract | `design.md` — icon and size rules; motion pending |
| The scope decision and the visual evidence | `TRABALHO/DESIGN SYSTEM/02 — Componentes/Registro de decisões e status — Componentes Nephos.md` |
| The artwork and the icon rules | `Fundação — ícones` (vault) |
| The motion rules | `Fundação — movimento` (vault) |
| The origin spec, now memory | `TRABALHO/DESIGN SYSTEM/02 — Componentes/fichas/nph-spinner.md` |
| What is open | `Pendências do Nephos` (vault) — **PF-05**, **PF-16** and **PI-05** |

---

*Provenance: function, variants, state, accessibility, relations, examples and
anti-patterns are **evidence** — they come from the origin spec, in draft, rewritten in the
nine-section model without any rule change. The visual approval and the scope decision
are a **human decision** by Indiane. **The `api` block is a proposal**, and it is marked as such:
there is no code to check. The AI hints are **new**. PF-05, PF-16 and PI-05 are
**pending items** already recorded. The spec is born incomplete by Indiane's decision on
31-08-2026, and nothing was invented to fill what is missing.*
