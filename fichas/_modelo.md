---
titulo: "Spec template — Nephos"
tipo: agentic contract template
criado: 2026-08-31
atualizado: 2026-08-31
status: awaiting review
leitura_obrigatoria: true
precedencia: 5
aplica_se_a: [componente, bloco, layout, template]
fontes:
  - "`TRABALHO/DESIGN SYSTEM/02 — Componentes/Template de ficha — peças do Nephos.md` — version 1.0, of 20-08-2026"
  - "`Documentos obrigatórios de um Design System agêntico — especificação para o Nephos` (vault) — the 9-section model"
  - "`Índice — DS-Agentico` (vault)"
tags: [nephos, ds-agentico, ficha, template]
---

> **References marked `(vault)`** are in `02 PROJETOS/DS-Agentico/`, in the WORK BRAIN —
> outside this repository. They were Obsidian wikilinks and were converted into an
> explicit reference in the migration of 31-08-2026.

# Spec template — Nephos

> **Why the template comes before the specs.** One standard structure filled in thirteen
> times is worth more than thirteen documents that diverge. The agent learns the shape once
> and then knows where to look in any piece.
>
> Back to `Índice — DS-Agentico` (vault).

**How to use.** Copy the template in section 4. Fill in **everything**. A field that does not
apply gets `nao_se_aplica`; a field not yet decided gets `pendente` — never
leave it blank, because the agent reads blank as "does not exist" and invents.

**Where to save:** in this folder — `fichas/<name>.md`, **in the repository**. This template is
also canonical here, in `fichas/_modelo.md`. **Indiane's decision on 31-08-2026 (PI-01):** the
component specs and the template live in the repository, which is where `AGENTS.md`,
`CLAUDE.md` and `design.md` already told readers to open them, and where those who consume them are.

**In the vault there is only a pointer** to each one. If you find piece criteria
written there, it is an error: the source is this directory.

**What does not go in.** History, long justification, meeting talk or superseded
decision. A spec is a lean contract: consolidated decision, verifiable value, pointer and
procedure.

**And the spec does not document appearance.** "Button with a blue background and rounded corners" is
what you can see — what matters is missing.

## 1. The two halves

| Half | What it carries | Who reads it |
|---|---|---|
| **YAML** at the top | The **values**: tokens, variants, states, invalid combinations | The machine, without interpreting prose |
| **Markdown** below | The **criterion**: when to choose this piece and not the similar one, what never to do | The agent and the person, when deciding |

Both are required. The YAML alone describes the piece and does not teach how to choose it; the
Markdown alone is not verifiable.

**The API lives in the YAML, and only there.** Indiane's decision on 31-08-2026: property, type,
requiredness, default value and restriction are **values**, and a value is the machine's
half. **There is no "API" section in Markdown** — the nine sections are nine in every
spec. The text explains *when to choose the piece*; the YAML says *what it accepts*.

## 2. The six writing rules

1. **Absolute imperative in the rules.** "The spacing is **strictly** 4px" — the
   word "strictly" warns the agent that the rule does not break. "Prefer" and
   "usually" invite the exception.
2. **The anti-patterns section is required.** A spec without "never do" is incomplete,
   even if it looks complete. It is the section with the highest return per line written.
3. **Invalid combinations are not optional.** They are what prevents the invention of variants
   that would not work.
4. **Semantic tokens only.** No spec cites `core/*`, `theme/*` or a literal value.
5. **The spec text is in English** (P64, amendment of 06-10-2026). YAML keys and
   single-word contract values stay as they are until DSA-15.
6. **Also document what is not yours.** A third-party component used as is
   needs a spec — the vendor's documentation says what it does, not **when to
   choose it within Nephos**. That layer is yours.

And one migration rule: **migrating is not copying.** The current content was written for
people to read. When bringing it here, rewrite it in decision format, instead of copying
visual description.

## 3. The nine sections

> **Foundation does not use this template.** Indiane's decision on 31-08-2026: the eight
> foundation specs have **their own shape** — meaning of each token · usage rule ·
> anti-patterns · what the foundation does not cover · AI hints · sources and decisions.
> "Variants", "States" and "Relations" do not describe a foundation: color has no hover
> state, it **is** what hover uses. See `Fundação — cor` (vault), which is the template for the
> other seven.

| # | Section | What it answers |
|---|---|---|
| 1 | Function | the problem it solves · when to use · when **not** to use |
| 2 | Variants | the variants · choose this when · do not combine with |
| 3 | States | the states · **which token each state uses** · what changes for the person · feedback and focus |
| 4 | Accessibility | semantics · accessible name · keyboard and focus · contrast |
| 5 | Relations | combines with · **what is parent, what is child** · **which block it complements** · in which layouts it appears |
| 6 | Tokens, intent and **AI hints** | semantic tokens · usage restrictions · **when to choose this piece and not the similar one** |
| 7 | Examples | recommended case · alternative case |
| 8 | Anti-patterns | do not use for · do not combine with · invalid combinations · do not create without a decision |
| 9 | Sources and decisions | `design.md` · the originating decision · tests · usage evidence |

## 4. The template — copy from here

```markdown
---
peca: nph-<nome>                      # or the name of the block, layout or template
nivel: componente                     # componente | fundacao | bloco | layout | template
status: rascunho                      # rascunho | vigente | descontinuado
resolve: >-
  One sentence: the problem this piece solves.
use_quando: []                        # concrete situations
nao_use_quando: []                    # each item points to the right piece for the case
api:                                  # the piece's PUBLIC CONTRACT. It does not become a section
  <propriedade>:                      #   in Markdown: API is a value, and values live here
    tipo: ""                          # string | boolean | number | enum
    valores: []                       # only when tipo=enum; the closed list
    obrigatoria: false                # true | false
    padrao: ""                        # the value assumed when nothing is passed
    reflete: false                    # true when it becomes a DOM attribute, and why
    restricao: ""                     # the usage limit, when there is one
variantes:
  <nome-da-variante>:
    eixo: aparencia                   # aparencia | tamanho | densidade
    escolha_quando: ""
    nao_combine_com: []
estados:
  <nome-do-estado>:
    token: ""                         # WHICH semantic token this state uses
    muda_para_a_pessoa: ""
regras_de_negocio: []                 # domain rule the piece carries
erros_de_dominio: []                  # product error states, not only visual ones
tokens:                               # semantic layer ONLY
  <propriedade>: <token>
dicas_para_ia: []                     # choice sentences, in natural language
acessibilidade:
  semantica: ""                       # element or role
  nome_acessivel: ""                  # where the name comes from
  teclado: []                         # keys and what each one does
  foco: ""
  contraste: ""                       # pendente until PI-05 sets the WCAG level
  alternativa_a_cor: ""               # how the state is perceived without color
combinacoes_invalidas: []             # each item: what is not allowed and why
relacoes:
  combina_com: []
  pai: []                             # what usually contains this piece
  filho: []                           # what this piece usually contains
  complementa_bloco: []               # the link with Phase 5
  aparece_em: []                      # blocks, layouts or templates
  # at composition levels, add:
  # exige: []                         # required pieces
  # variacoes_aceitaveis: []
  # contexto_de_layout: ""
anti_padroes: []
fontes:
  design_md: ""
  decisao: ""                         # the decision that originated the piece, with date
  testes: ""
  evidencia_de_uso: ""                # where it is actually used already
  storybook: ""
  figma: ""
---

# <piece name>

## Function

- **Problem it solves:**
- **When to use:**
- **When NOT to use:**

## Variants

- **Variants by appearance:**
- **Variants by size:**
- **Variants by density:**
- **Choose this variant when:**
- **Do not combine with:**

## States

- **Supported states, and the token of each one:**
- **What changes for the user:**
- **Feedback and focus rules:**
- **Business rule the piece carries:**
- **Domain error states:**

## Accessibility

- **Required semantics:**
- **Accessible name and labels:**
- **Keyboard and focus:**
- **Contrast:**
- **Alternative to color:**

## Relations

- **Combines with:**
- **What is parent (what this piece appears inside):**
- **What is child (what it contains):**
- **Which block this piece complements:**
- **Appears in the layouts:**

## Tokens, intent and AI hints

- **Semantic tokens used:**
- **Usage restrictions:**
- **AI hints:**
  - <one sentence per line, saying WHEN to choose this piece and not the similar one>

## Examples

- **Recommended case:**
- **Alternative case:**

## Anti-patterns

- **Do not use for:**
- **Do not combine with:**
- **Invalid combinations, and why:**
- **Do not create or adapt without a decision:**

## Sources and decisions

- **The repository `design.md`:**
- **The originating decision, with date and owner:**
- **Tests:**
- **Usage evidence:**
- **Storybook:**
- **Figma:**
```

## 5. What changes in block, layout and template

**Same template** — they do not get their own structure —, with four additions in
`relacoes` and in the Relations section:

| Addition | What it answers |
|---|---|
| `exige` | Which pieces the composition **requires**. Without them, it is not that composition |
| `variacoes_aceitaveis` | What can change without becoming something else |
| `contexto_de_layout` | In which layout it usually appears |
| Composition goal | Which interface goal it solves — not the appearance |

**The criterion that separates component from block:** a component is reusable in any
context; a block solves a specific situation. A button is a component. "Action bar
of a listing — filter, export, create new" is a block.

**Origin restriction:** block, layout and template are only documented after being
**extracted** from a real pattern or from an approved mock. None of the three is born because
it appeared in a reference.

## 6. The three sections that are not negotiable

- **Relations** is what ties the levels together. Without it, the agent knows how to build the piece and **does not
  know where to fit it** — and the result is a screen that gathers correct components without
  forming a coherent interface.
- **Anti-patterns** cuts the error space. It is what prevents the AI from inventing variants
  that would not work. A document without "never do" is incomplete, even if it looks
  complete.
- **AI hints** is the easiest to forget, because it seems to repeat the list of
  tokens. It does not: **the list says what the piece consumes; the hint says when to choose
  this piece and not the similar one.** Example: "use for the main action of the form;
  for simple navigation, use a link".

## 7. When the spec is ready

The piece leaves the queue when:

1. the spec answers **all** items, with no blank field;
2. the cited tokens are semantic and have been audited;
3. each state names the token it uses;
4. there is a Figma page with purpose, anatomy, variants, states and usage limits;
5. **each variant and each state appears in some verifiable story** — one
   story can cover more than one combination, and no combination is left out. The
   criterion is **traceable coverage**, not the number of files, pages or
   stories. *Indiane's decision on 09-09-2026; it replaces the previous format
   rule, which required one story per variant and per state;*
6. Figma and Storybook do not diverge — or the divergence is recorded with the decision that
   is missing;
7. the AI hints exist and say when to choose this piece, not what it is;
8. the `api` block is complete and **matches the code**, when the piece is already
   implemented — property by property, not by impression.

An incomplete checklist means a piece **in progress**, not a delivered piece.

## 8. Where to start

**With the specs of `nph-icon` and `nph-label`.** They are the two components already
implemented and integrated in the main branch: they have the most evidence in the repository and
calibrate the format for the next three.

> Version 1.0 of this template, of 20-08-2026, recommended starting with `nph-input`,
> because it is the densest component and the best test of the template. The reasoning is still
> sound, but it was **superseded by Indiane's decision on 30-08-2026**: real code evidence
> weighs more than density, at this point in the project. `nph-input` is the fifth
> spec.

---

*Provenance: the structure, the two halves, the writing rules, the base template and the
readiness criterion are **evidence** — they come from `Template de ficha — peças do Nephos.md`,
version 1.0, of 20-08-2026. The nine sections, the additions of state, density,
parent and child relation, AI hints and "Sources and decisions" are **a requirement of the yardstick**.
The filling order is a **human decision** by Indiane, on 30-08-2026. The destination of the
contrast level is **pending** — PI-05. The destination of the file was decided by
Indiane on 31-08-2026: repository, in `fichas/`.*
