---
peca: nph-label
nivel: componente
status: vigente
titulo: "nph-label"
tipo: component spec
criado: 2026-08-31
atualizado: 2026-08-31
resolve: >-
  Names a form control in a visible and accessible way. The label is
  only text, and it carries no layout, state, help or error message.
use_quando:
  - "A form control needs a visible name, on its own or inside an nph-field."
nao_use_quando:
  - "It is a sentence with a verb and a full stop — that is `text/body-md`."
  - "It opens a section or group — that is `text/heading-sm`."
  - "It is emphasis inside a paragraph — that is `<strong>`."

api:
  text:
    tipo: string
    obrigatoria: true
    padrao: "vazio"
    reflete: false
    restricao: >-
      Carries the label content, already localized by the consuming application.
      It exists as a property because, without Shadow DOM, there is no `slot`.
  required:
    tipo: boolean
    obrigatoria: false
    padrao: false
    reflete: true
    restricao: >-
      Adds the asterisk at the end of the text. The asterisk is decorative
      (`aria-hidden`): the requiredness must be communicated by the control.
  for:
    tipo: string
    obrigatoria: false
    padrao: nulo
    reflete: true
    restricao: >-
      `id` of the control this label names. It mirrors the native attribute and is the
      association mechanism — the reason the component does not use Shadow DOM.
  slots: nenhum
  eventos: nenhum
  cor: >-
    It is not a property. The text is `color/foreground` and the asterisk is
    `status/error`, always — including when the field is in error.

variantes:
  required:
    eixo: aparencia
    escolha_quando: "true when filling in the field is required"
    nao_combine_com: ["layout", "weight", "state"]

estados:
  nenhum:
    token: nao_se_aplica
    muda_para_a_pessoa: "Nothing changes in the label. Error and disabled are shown by the field and by the composition"

regras_de_negocio:
  - "A required field is signaled by the asterisk — and the actual requiredness belongs to the control"
erros_de_dominio: []

tokens:
  texto: [text/label-md]
  cor_do_texto: color/foreground
  cor_do_asterisco: status/error
  espaco_antes_do_asterisco: space/inline-tight

dicas_para_ia:
  - "A field label is `nph-label`; a sentence with a verb and a full stop is not."
  - "The label does not change on error. The field and the message change."
  - "Do not look for a layout property: the position belongs to `nph-field`."
  - "`required=true` alone does not communicate requiredness to a screen reader."

acessibilidade:
  semantica: "Native `<label>` element"
  nome_acessivel: "The label is the source of the accessible name of the control"
  teclado: []
  foco: "It does not receive focus and has no key of its own"
  contraste: "Measured on 27-08-2026 in both modes; the four combinations pass at 4.5:1"
  alternativa_a_cor: "The asterisk is a shape signal, not a color one — and it is decorative"

combinacoes_invalidas:
  - "`required=true` without a visible legend explaining the convention in the form"
  - "Creating a layout, weight or state property — all three were refused by decision"

relacoes:
  combina_com: [nph-input, nph-field, nph-checkbox]
  pai: [nph-field]
  filho: []
  complementa_bloco: [pendente]
  aparece_em: [pendente]

anti_padroes:
  - "Changing the label color when the field enters error"
  - "Using `nph-label` to open a section or give emphasis"
  - "Treating the asterisk as the requiredness signal for assistive technology"

fontes:
  design_md: "design.md, in the repository"
  decisao: "P62.1, P62.2 and P62.3, approved by Elvys on 28-08-2026"
  testes: "src/components/nph-label/nph-label.test.ts"
  evidencia_de_uso: "branch v/3.0.0, PR #10, merge e231eba"
  storybook: "src/components/nph-label/nph-label.stories.ts"
  figma: "page NPH — Label, master set 374:6"
tags: [nephos, ds-agentico, ficha, componente, nph-label]
---

> **References marked `(vault)`** are in `02 PROJETOS/DS-Agentico/`, in the WORK BRAIN —
> outside this repository. They were Obsidian wikilinks and were converted into an
> explicit reference in the migration of 31-08-2026.

# nph-label

> **The principle that governs this piece, approved by Indiane on 27-08-2026: the label is
> only text.** It carries no layout, state, help or error message.
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

**By appearance — `required`:** `false` and `true`. **These are two combinations, and this is the
only variant property of the component.**

**By size and by density:** `nao_se_aplica`. The label has a single text role.

**Do not combine with:** `layout`, `weight` and `state`. **All three were refused by a recorded
decision** on 27-08-2026 — layout belongs to `nph-field`, weight belongs to the typography foundation, and
the label has no state.

## States

**Supported states: none.** The label **has no state of its own**, and this is a decision,
not an omission.

| The situation | Where it appears |
|---|---|
| **Error** | **The label does not change.** It stays in `color/foreground`. The error stays in the field and in the message |
| **Disabled** | It does not belong to the label. `nph-field` applies `state/disabled-opacity` to the whole control |
| **Help and error message** | They belong to `nph-field`. The label carries only the text and the asterisk |

**What changes for the person:** nothing, in the label.

**Feedback and focus:** the label **is not focusable**. Activating the label moves focus to the
associated control — native `<label>` behavior, which only works because of the
decision not to use Shadow DOM.

**Business rule the piece carries:** the asterisk signals a required field. **But the
asterisk is decorative** — see Accessibility.

## Accessibility

| Criterion | Rule |
|---|---|
| Semantics | Native `<label>` element |
| Association | Through the `for` attribute, pointing to the `id` of the control |
| Accessible name | **The label is the source of the accessible name of the control.** When there is an associated visible label, the control does **not** receive a duplicate name through `aria-label` |
| Keyboard and focus | It does not receive focus and has no key of its own |
| Contrast | Measured on 27-08-2026, in both modes: the four combinations pass the minimum of 4.5:1 |
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

**What is the child:** nothing. `nph-label` is a leaf.

**Which block it complements:** `pendente` — Phase 5 has not started.

**Appears in layouts:** `pendente`, for the same reason.

**The boundary, in writing:** help and error message **do not belong to the label**. If you are
thinking of adding either of them here, the place is `nph-field`.

## Tokens, intent and AI hints

**Semantic tokens used** — checked in the component CSS on 31-08-2026:

| Part | Token |
|---|---|
| The text | `text/label-md`, in the five properties of the role |
| The text color | `color/foreground` |
| The asterisk color | `status/error` |
| The space before the asterisk | `space/inline-tight` |

**This piece is the first proof in code of P62.2** — the fourteen text roles with
five properties each. Without them, the label would only exist with a literal value.

**Usage restrictions:** the `use` of `status/error` was **extended in `design.md` before the
code**, to cover the asterisk. The label color **does not change** in any situation.

**AI hints:**

- **A field label is `nph-label`.** A sentence with a verb and a full stop is not — it is `body-md`.
- **The label does not change on error.** The field and the message change. If you are
  looking for how to make the label red, the answer is: you don't.
- **Do not look for a layout property.** The label position belongs to `nph-field`.
- **`required=true` alone does not communicate requiredness** to a screen reader. The control
  must say so in code, and the form needs a visible legend.
- **`text` is a property, not content between the tags.** Without Shadow DOM there is no `slot`.

## Examples

**Recommended case:** `nph-label` with `text` and `for` pointing to the `id` of `nph-input`,
inside an `nph-field` — the label names, the field composes.

**Alternative case:** `required=true` in a form that already has the visible legend
explaining the asterisk, with the requiredness also declared on the control.

## Anti-patterns

- **Do not use to:** open a section, give emphasis, or write running text.
- **Do not combine with:** a layout, weight or state property — all three were refused
  by decision.
- **Invalid combinations, and why:** `required=true` without a visible legend in the form
  — the asterisk alone does not explain the convention · changing the label color on error — the
  decision is that it does not change · expecting the asterisk to announce requiredness to a screen
  reader — it is `aria-hidden`.
- **Do not create or adapt without a decision:** a new variant, an own color token, or
  any property beyond the three.

## Sources and decisions

### Implementation status — evidence verified on 31-08-2026

| What | Evidence |
|---|---|
| Implemented and integrated | It is on the default branch `v/3.0.0`, through **PR #10**, merge `e231eba`, on 28-08-2026. **It is the second component available on the default branch** |
| The code API | `text`, `required` and `for` — **it is P62.3**, checked property by property in `src/components/nph-label/nph-label.ts` |
| `required` and `for` reflect in the DOM | Confirmed in the code |
| No Shadow DOM | Confirmed, with the reason written in the file itself |
| Tokens consumed | Checked in `nph-label.css`: `text/label-md` (five properties), `color/foreground`, `status/error`, `space/inline-tight` |
| Stories and tests | In `nph-label.stories.ts` and `nph-label.test.ts` |
| Visual approval | Indiane, on **27-08-2026**, master set `374:6` on the `NPH — Label` page, in light and dark modes |

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
| 5 | Boundary with `nph-field` | **Help and error message belong to `nph-field`** |

| What | Where |
|---|---|
| Technical contract | `design.md`, in the repository |
| The technical decisions | `docs/decisoes-tecnicas.md` — P62.1, P62.2 and P62.3 |
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
No change was made to code, tokens, tests, Figma or repository.*
