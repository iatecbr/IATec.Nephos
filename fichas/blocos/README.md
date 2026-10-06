# Blocks — where they live and how they connect

This directory holds the **block** specs: `fichas/blocos/<name>.md`, one file per
block, as [`design.md`](../../design.md) declares in §9.

> **Empty on purpose.** No block is documented here, and that is the correct
> result. What exists today is the convention; the first block comes in when the origin
> restriction, below, is met.

## 1. The template is the same as the component specs'

Copy it from [`fichas/_modelo.md`](../_modelo.md). **A block has no template of its own** — §5
of the template is explicit: *"Same template — they do not get their own structure"*. They are the
same two halves, the same nine sections and the same six writing rules.

What changes is the `nivel` field, which becomes `bloco`, and the `peca` field, which gets the **name of the
block** — without the `nph-` prefix, which belongs to components.

A field that does not apply gets `nao_se_aplica`; a field not yet decided gets
`pendente`. The agent reads blank as "does not exist" and invents.

## 2. The four additions

In `relacoes`, and in the **Relations** section in Markdown, the block spec adds:

| Addition | What it answers |
|---|---|
| `exige` | Which pieces the composition **requires**. Without them, it is not that composition |
| `variacoes_aceitaveis` | What can change without becoming something else |
| `contexto_de_layout` | In which layout it usually appears |
| Composition goal | Which interface goal it solves — not the appearance |

The criterion that separates component from block: **a component is reusable in any
context; a block solves a specific situation.** A button is a component. "Action bar
of a listing — filter, export, create new" is a block.

## 3. The linking convention — and its direction

Contract, spec and Storybook are linked **by a pointer declared in the spec, always
outward**. That is the direction that keeps the pointer from breaking when a new block is born.

| Pointer | Where it lives | What it points to |
|---|---|---|
| contract | `fontes.design_md` | the `design.md` section that decides what the block uses |
| decision | `fontes.decisao` | the decision that originated the block, with date and owner |
| Storybook | `fontes.storybook` | the story that renders the block |
| evidence | `fontes.evidencia_de_uso` | where the block is actually used already |

**The way back does not exist, and that is on purpose.** `design.md` does not list block by block: §9
points to `fichas/blocos/<name>.md` as a class. Documenting a new block, therefore,
**does not change the contract** — and a contract that does not change with every block is a contract that does not
accumulate dead pointers.

**Between levels, the link is declared on both sides, and only in `relacoes`.** The
component spec declares `complementa_bloco` and `aparece_em`; the block spec declares `exige` and
`contexto_de_layout`. Neither side describes the other: each one names the other.

**Storybook derives, it does not replace.** The spec is canonical; the Storybook Metadata surface
is derived from it — see [`docs/operacao/README.md`](../../docs/operacao/README.md),
§7. The story covers **each variant and each state**, one per variant and per state, as
§7 of `_modelo.md` requires.

## 4. When a block can be written here

**Origin restriction, and it cannot be bypassed:** block, layout and template are only
documented after being **extracted** from a real pattern or from an approved mock. None of the three
is born because it appeared in a reference. The rule is in `_modelo.md`, §5, and in
[`README.md`](../../README.md), under Taxonomy.

In practice: a block that does not yet exist on a screen or in an approved mock **has no spec
here** — not even as a draft. Writing it earlier is inventing composition.

## 5. What this convention does not do

- **It documents no block.** It only says where and how.
- **It does not create a second template.** `_modelo.md` remains the only one.
- **It does not change `design.md`.** It fulfills its §9.
- **It does not decide how Metadata reads the spec** — build or runtime. That decision is open
  and does not belong to this stage.
- **It does not apply to layout and template.** They follow the same rule of `_modelo.md`, and the
  directory of each one is born when the first one is extracted.
