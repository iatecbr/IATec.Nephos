# Operation — tasks, contexts and evidence

This note is the contract for Nephos's operational structure. It exists only in
`pt-BR`: it is internal instruction for whoever maintains the repository, not
usage documentation. See [`../i18n.md`](../i18n.md).

> **Empty structure, on purpose.** `tarefas/`, `contextos/` and `evidencias/`
> start with no real content. Migrating the live work is the next milestone, with
> a reconciliation table. Until that happens, the query answers an empty queue —
> and that is the correct result.

## What it is for

An agent that opens the repository needs to answer three questions without
depending on a session's memory: **what is open, what is safe to do now, and what
proves that something is finished.** These three directories answer all three,
and the verifier stops the answer from being plausible and false.

```bash
npm run test:operacao                            # validates the tree
node scripts/verificar-operacao.mjs --proxima    # validates and shows the queue
node scripts/verificar-operacao.mjs --exemplos   # self-test over the fixtures
node scripts/verificar-operacao.mjs --gerar-metadata   # writes the specs' Metadata and validates
```

The query is a flag of the same binary, not a new command: one command per step
is the parallel pipeline the plan forbids.

## The two halves of each file

Task, context and evidence have the same shape: a **fenced JSON block**, the first
in the file, followed by Markdown prose. The JSON gives the values, which the
machine reads without interpreting text; the Markdown gives the criterion, which
the person reads.

The format is JSON and not YAML because adopting a full YAML reader would cost a
new dependency, and `JSON.parse` already ships with Node. The spec is the
exception: its YAML is read by `scripts/spec-lib.mjs`, which covers only a closed
subset — see §7.

## 1. Task

`tarefas/<ID>.md`. **The file name is the `id`** — so a duplicate is impossible by
construction.

The identifier matches `^[A-Z][A-Z0-9]{1,3}-[A-Z0-9]{1,6}$`, which accepts the IDs
already used in the project (`DSA-01`, `F4-T01`, `PE-01`, `PI-05`, `PF-15`, `PO-001`).
Preserving the original ID is what keeps the link to the previous record without
copying content.

```json
{
  "id": "F4-T01",
  "objetivo": "One sentence: what the task delivers.",
  "fase": "F4",
  "ordem_aprovada": 30,
  "responsavel": "claude-codigo",
  "estado": "bloqueada",
  "peca": "nph-button",
  "dependencias": ["DSA-01"],
  "gates": [
    {
      "id": "documentacao-figma-aceita",
      "descricao": "The component documentation in Figma was accepted by Indiane.",
      "comando": null,
      "evidencia": null,
      "resultado": "pendente",
      "verificado_em": null,
      "verificado_por": null
    }
  ],
  "bloqueios": [
    {
      "id": "B1",
      "o_que_trava": "What prevents moving on.",
      "dono": "indiane",
      "o_que_resolve": "What closes the blocker.",
      "aberto_em": "2026-09-02"
    }
  ],
  "decisoes_pendentes": [],
  "evidencias": [],
  "referencias_de_decisao": ["docs/decisoes-tecnicas.md#p62"],
  "origem_externa": null,
  "revisao_git": { "branch": null, "commit": null, "pr": null },
  "contexto": null,
  "atualizado_em": "2026-09-02"
}
```

**The schema is closed:** a top-level key outside this list is an error, not an
ignored key.

| Field | Type | Rule |
|---|---|---|
| `id` | string | matches the pattern and the file name |
| `objetivo` | string | one sentence; what the task delivers |
| `fase` | `F0` to `F7` | the phase in the phase plan |
| `ordem_aprovada` | integer ≥ 1 | unique among the tasks that are not `concluida` |
| `responsavel` | enum | `indiane`, `claude-codigo`, `claude-figma`, `copilot`, `elvys` |
| `estado` | enum | the six below |
| `peca` | string or `null` | when filled in, requires `fichas/<peca>.md` in `em-revisao` and `concluida` — see §2b |
| `dependencias` | list of IDs | may be empty |
| `gates` | list of objects | at least one, each with `id`, `descricao` and `resultado` |
| `bloqueios` | list of objects | may be empty |
| `decisoes_pendentes` | list of objects | may be empty |
| `evidencias` | list of paths | from the repository root |
| `referencias_de_decisao` | list of strings | may be empty |
| `origem_externa` | object or `null` | see §4 |
| `revisao_git` | object | `branch`, `commit`, `pr`; each a string or `null` |
| `contexto` | path or `null` | `docs/operacao/contextos/<ID>.md` |
| `atualizado_em` | `AAAA-MM-DD` | — |

Below the block, four fixed sections — the same in every task:

```markdown
# <ID> — <short title>

## Goal
What exists at the end, in one sentence, and how you can tell it exists.

## How it is proved
One paragraph per gate: the command or the observation, and what counts as passing.

## What this task does not do
The limit. It is the section that stops the scope from growing mid-execution.

## Sources
The paths the execution opens — and only those.
```

## 2. The six states, and what each one requires

| State | Only valid when |
|---|---|
| `pronta` | **all** dependencies are `concluida` |
| `em-andamento` | `contextos/<ID>.md` exists, with `worktree` and `sha_inicial` |
| `aguardando-decisao` | there is at least one pending decision, with `pergunta` and `quem_decide` |
| `bloqueada` | there is at least one blocker, with `dono` and `o_que_resolve` |
| `em-revisao` | `revisao_git.pr` is filled in |
| `concluida` | **every** gate is `passou`, with evidence that exists on disk, `verificado_em` and `verificado_por` — and **no** context file |

A state that lies is an error, not an oversight. The verifier does not accept the
word `concluida`: it opens the evidence file.

## 2b. The documentation lock: Figma → local code → spec → review

A **component task** is one with `responsavel: "claude-codigo"` **and** `peca`
filled in. For it, the order of the work is enforced by the machine, not by the
goodwill of whoever executes it:

| Moment | What must already exist | Who enforces it |
|---|---|---|
| Before any component code | the `documentacao-figma-aceita` gate with `resultado: "passou"` | `V30` |
| While the task is `pronta` or `em-andamento` | nothing beyond that — **local code without a spec is allowed** | — |
| Before `em-revisao` and `concluida` | the canonical spec in `fichas/<peca>.md` | `V28` |

**Why the two sets of states differ.** The documentation in Figma is what stops
the component from being born wrong, so it comes first. The spec is the
piece's consolidated contract — it comes out of practice, and requiring it in the
first commit would turn the contract into a form filled in blind. Local code
without a spec is work in progress, not a violation; code without accepted
documentation is invention.

The task's own `origem_externa` stays governed by §4 and does **not** replace the
gate: where the task came from is one thing, the piece's documentation having been
accepted is another.

## 3. The order of the next activity

**Only a task in `pronta` is eligible.** Since `pronta` already requires all
dependencies to be `concluida`, eligibility and dependency are the same test.

Among the eligible ones, in this exact order:

1. `ordem_aprovada` ascending — the approved order always comes first;
2. `fase` ascending — `F0` before `F7`;
3. number of tasks that depend on it, descending — ties go to the one that unblocks more;
4. `id` in alphabetical order — the final tie-breaker, which guarantees a total order.

Criterion 4 exists so that there is **never** a tie: two runs over the same tree
return the same output, byte for byte.

The answer is not just the task name. It is the ordered queue plus the exclusion
table, with the reason for each task left out.

**If validation fails, `--proxima` does not answer.** It returns the errors and
exits with 1. A queue computed over an invalid tree is worse than no queue.

## 4. External origin and sanitization

Figma, Slack, Fireflies, Jira, Linear, Notion and the like can originate
information. None of them becomes a current source on its own. `origem_externa` is
`null` or:

```json
{
  "classificacao": "interna-permitida",
  "url_ou_id": "<URL or ID in the originating system>",
  "data": "2026-08-17",
  "autoria": "<who recorded it>",
  "trecho": "<the minimal technical record, already sanitized>",
  "decisao_convertida": "<the requirement or decision that came out of it>"
}
```

| Classification | What the verifier enforces |
|---|---|
| `publica` | requires `url_ou_id` and `data` |
| `interna-permitida` | requires `url_ou_id`, `data`, `autoria` and `decisao_convertida` |
| `interna-restrita` | **fails if there is a `trecho`**; the task must be `bloqueada` or `aguardando-decisao` |
| `desconhecida` | same |

Restricted or unknown origin **is not copied**: it becomes a pending item for
whoever decides to indicate the policy or the responsible person.

**Secret scan.** In `tarefas/`, `contextos/` and `evidencias/`, the verifier fails
on the pattern of a GitHub personal token, an npm registry credential, a Font
Awesome token with a value, and a private-key delimiter. The rule this automates
was already written: the local credential configuration stays out of Git, and is
not read, exposed, added or versioned.

## 5. Evidence

`evidencias/<task-ID>/<gate>-<AAAA-MM-DD>.md`, with the same machine block at the
top and the output pasted below, unedited:

```json
{
  "tarefa": "<ID>",
  "gate": "<gate id>",
  "data": "2026-09-02",
  "responsavel": "claude-codigo",
  "comando": "npm run test:operacao",
  "codigo_de_saida": 0,
  "sha": "<revision SHA>",
  "origem_externa": null
}
```

The path declared in `evidencias[]` and in `gates[].evidencia` is **from the
repository root** and must exist on disk; the file's `tarefa` field must match the
ID that references it. A pointer that points to nothing does not raise an error on
its own — it just stops working. That is why the verifier opens the file.

### 5b. The evidence for the documentation gate

The `documentacao-figma-aceita` gate has a format of its own, because what it
proves is not the output of a command: it is a **human acceptance**. The evidence
lives in `evidencias/<ID>/`, in the tree itself, and the verifier enforces the
whole provenance (`V31`):

```json
{
  "tarefa": "<ID>",
  "gate": "documentacao-figma-aceita",
  "data": "2026-09-10",
  "responsavel": "indiane",
  "comando": null,
  "codigo_de_saida": null,
  "sha": null,
  "origem_externa": {
    "classificacao": "interna-permitida",
    "url_ou_id": "<URL or ID of the frame in Figma>",
    "data": "2026-09-10",
    "autoria": "<who recorded it>",
    "trecho": null,
    "decisao_convertida": "<the accepted frame and the COMPONENT_SET that came out of it>"
  }
}
```

| What `V31` enforces | Why |
|---|---|
| `gate` is `documentacao-figma-aceita` | the evidence cannot serve another gate by mistake |
| `responsavel` is `indiane` | accepting documentation is her decision, not the agent's |
| `origem_externa.classificacao` is `interna-permitida` | Figma is internal, and permitted: see §4 |
| `origem_externa.url_ou_id` names Figma | without the pointer, nobody can reopen the frame |
| `origem_externa.data` in `AAAA-MM-DD`, and `autoria` | when, and by whom |
| `origem_externa.decisao_convertida` names the **frame** and the **COMPONENT_SET** | it is the link between what was accepted and what will be built |
| the file is in `evidencias/<ID>/` | the proof is local and versioned, not a link that vanishes |

**Restricted Figma content is not copied here.** What goes in is the converted
decision — the requirement that came out of the frame —, not the frame's content.
It is the same rule as §4, applied to evidence.

## 6. Short context

`contextos/<ID>.md`. One per task, tied to a worktree, **rewritten on every
pass**. It does not accumulate a conversation diary.

```json
{
  "tarefa": "<ID>",
  "worktree": "<worktree path>",
  "sha_inicial": "<SHA>",
  "sha_final": null
}
```

Below the block, eight fixed sections: goal of this pass, sources opened, changes,
commands run, result, evidence, blocker and next command.

**The context does not decide.** The keys `estado`, `fase`, `ordem_aprovada`,
`prioridade`, `escopo` and `decisao` are forbidden in it — the only way to enforce
the rule is to forbid the key, because trusting whoever writes is not
verification. The set of keys is closed at the four above.

**Ceiling of 60 lines.** A context that grows has become a diary, and a diary is
the handoff all over again. The number is an alarm, not an exact measure.

When the task concludes, the context leaves the active area. Git preserves the
history.

## 7. The spec is the source; the Metadata derives from it

The component spec is canonical in `fichas/<nome>.md`, with the template in
`fichas/_modelo.md`. Storybook presents that spec on a Metadata surface **derived
from it** — the Metadata replaces neither the spec nor the code.

That is why the verifier fails `meta.ts` and `metadata.ts` inside
`src/components/`: a second contract beside the component is exactly the pointer
that breaks silently. The rule covers those two file names, and does not forbid
stories or variables called `meta`.

**The Metadata is generated at build** (P63). `node scripts/verificar-operacao.mjs
--gerar-metadata` reads the YAML of each current spec and writes
`src/shared/metadata/<peca>.json`. The file is never edited by hand: whoever
changes the spec generates it again in the same commit, and `V32` fails a copy that
does not match the spec.

**The spec is enforced at the end, not at the start.** `V28` only requires
`fichas/<peca>.md` in `em-revisao` and `concluida`. Before that, the piece may have
local code and no spec — see §2b.

## 8. The 32 verifier rules

Each error comes out with the code, the path and the message.

**Structure** · `V01` file name equal to the `id` · `V02` `id` matches the pattern
and is unique · `V03` the first JSON block exists, parses, and no top-level key is
outside the schema · `V04` required field present and not empty

**State** · `V05` `estado` is one of the six · `V06` `concluida` with every gate
`passou` and existing evidence · `V07` `bloqueada` with an open blocker, `dono` and
`o_que_resolve` · `V08` `aguardando-decisao` with `pergunta` and `quem_decide` ·
`V09` `pronta` with all dependencies `concluida` · `V10` `em-revisao` with
`revisao_git.pr`

**Dependencies** · `V11` every cited ID exists · `V12` no cycle ·
`V13` no self-dependency

**Gates and evidence** · `V14` gate with `id`, `descricao` and `resultado` ·
`V15` `passou` gate with `evidencia`, `verificado_em` and `verificado_por` ·
`V16` the evidence path exists on disk · `V17` the evidence's `tarefa` field
matches the ID

**External origin** · `V18` classification is one of the four · `V19` restricted or
unknown without `trecho`, and the task in `bloqueada` or `aguardando-decisao` ·
`V20` permitted with the four fields · `V21` secret scan

**Context** · `V22` the context points to an existing task · `V23` closed set of
keys, without the six forbidden ones · `V24` at most 60 lines ·
`V25` `concluida` without context · `V26` `em-andamento` with context, `worktree` and
`sha_inicial`

**Metadata contract** · `V27` no `meta.ts` or `metadata.ts` in
`src/components/` · `V28` `peca` filled in requires `fichas/<peca>.md` **in
`em-revisao` and `concluida`** · `V32` the Metadata in `src/shared/metadata/` is an
exact copy of each current spec, there is no JSON without a current spec, and the
spec fits the grammar of `scripts/spec-lib.mjs`

**Queue** · `V29` `ordem_aprovada` integer ≥ 1, unique among those not `concluida`

**Documentation lock** · `V30` a component task in `pronta`, `em-andamento`,
`em-revisao` or `concluida` requires the `documentacao-figma-aceita` gate with
`resultado: "passou"` · `V31` the evidence for that gate proves provenance: matching
`gate`, `responsavel` `indiane`, `origem_externa` `interna-permitida` with the
Figma URL or ID, `data`, `autoria` and `decisao_convertida` naming the frame and the
`COMPONENT_SET`, in `evidencias/<ID>/`

## 9. The examples

The verifier's fixtures live in `scripts/fixtures/operations/`, **outside this
tree**. They are test inputs, including ones that are invalid on purpose, and
staying outside here is what stops an invalid example from entering the real queue.

`node scripts/verificar-operacao.mjs --exemplos` runs the whole fixture tree and
requires each invalid case to fail **with the expected code**. Failing is not
enough: failing for the wrong reason is validation that does not validate.

## 10. What this structure does not do

- **It does not hold migrated state.** That is the next milestone.
- **It does not implement the Metadata surface.** It fixes the contract and the
  prohibition.
- **It does not replace the decision log.** A technical decision lives in
  `docs/decisoes-tecnicas.md`; the task only points to it.
- **It does not accumulate history.** The context is rewritten; Git keeps the past.
