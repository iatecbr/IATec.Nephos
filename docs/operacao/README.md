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
  "goal": "One sentence: what the task delivers.",
  "phase": "F4",
  "approved_order": 30,
  "owner": "claude-code",
  "state": "blocked",
  "piece": "nph-button",
  "dependencies": ["DSA-01"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The component documentation in Figma was accepted by Indiane.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "What prevents moving on.",
      "owner": "indiane",
      "what_resolves": "What closes the blocker.",
      "opened_at": "2026-09-02"
    }
  ],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": ["docs/decisoes-tecnicas.md#p62"],
  "external_origin": null,
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-09-02"
}
```

**The schema is closed:** a top-level key outside this list is an error, not an
ignored key.

| Field | Type | Rule |
|---|---|---|
| `id` | string | matches the pattern and the file name |
| `goal` | string | one sentence; what the task delivers |
| `phase` | `F0` to `F7` | the phase in the phase plan |
| `approved_order` | integer ≥ 1 | unique among the tasks that are not `done` |
| `owner` | enum | `indiane`, `claude-code`, `claude-figma`, `copilot`, `elvys` |
| `state` | enum | the six below |
| `piece` | string or `null` | when filled in, requires `fichas/<piece>.md` in `in-review` and `done` — see §2b |
| `dependencies` | list of IDs | may be empty |
| `gates` | list of objects | at least one, each with `id`, `description` and `result` |
| `blockers` | list of objects | may be empty |
| `pending_decisions` | list of objects | may be empty |
| `evidence` | list of paths | from the repository root |
| `decision_refs` | list of strings | may be empty |
| `external_origin` | object or `null` | see §4 |
| `git_review` | object | `branch`, `commit`, `pr`; each a string or `null` |
| `context` | path or `null` | `docs/operacao/contextos/<ID>.md` |
| `updated_at` | `AAAA-MM-DD` | — |

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
| `ready` | **all** dependencies are `done` |
| `in-progress` | `contextos/<ID>.md` exists, with `worktree` and `start_sha` |
| `awaiting-decision` | there is at least one pending decision, with `question` and `decider` |
| `blocked` | there is at least one blocker, with `owner` and `what_resolves` |
| `in-review` | `git_review.pr` is filled in |
| `done` | **every** gate is `passed`, with evidence that exists on disk, `verified_at` and `verified_by` — and **no** context file |

A state that lies is an error, not an oversight. The verifier does not accept the
word `done`: it opens the evidence file.

## 2b. The documentation lock: Figma → local code → spec → review

A **component task** is one with `piece` filled in; its owner is `elvys`
(see [`component-handoff.md`](component-handoff.md)). The verifier enforces the
order below on tasks with `owner: "claude-code"`:

| Moment | What must already exist | Who enforces it |
|---|---|---|
| Before any component code | the `figma-docs-accepted` gate with `result: "passed"` | `V30` |
| While the task is `ready` or `in-progress` | nothing beyond that — **local code without a spec is allowed** | — |
| Before `in-review` and `done` | the canonical spec in `fichas/<piece>.md` | `V28` |

**Why the two sets of states differ.** The documentation in Figma is what stops
the component from being born wrong, so it comes first. The spec is the
piece's consolidated contract — it comes out of practice, and requiring it in the
first commit would turn the contract into a form filled in blind. Local code
without a spec is work in progress, not a violation; code without accepted
documentation is invention.

The task's own `external_origin` stays governed by §4 and does **not** replace the
gate: where the task came from is one thing, the piece's documentation having been
accepted is another.

## 3. The order of the next activity

**Only a task in `ready` is eligible.** Since `ready` already requires all
dependencies to be `done`, eligibility and dependency are the same test.

Among the eligible ones, in this exact order:

1. `approved_order` ascending — the approved order always comes first;
2. `phase` ascending — `F0` before `F7`;
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
information. None of them becomes a current source on its own. `external_origin` is
`null` or:

```json
{
  "classification": "internal-allowed",
  "url_or_id": "<URL or ID in the originating system>",
  "date": "2026-08-17",
  "author": "<who recorded it>",
  "excerpt": "<the minimal technical record, already sanitized>",
  "converted_decision": "<the requirement or decision that came out of it>"
}
```

| Classification | What the verifier enforces |
|---|---|
| `public` | requires `url_or_id` and `date` |
| `internal-allowed` | requires `url_or_id`, `date`, `author` and `converted_decision` |
| `internal-restricted` | **fails if there is an `excerpt`**; the task must be `blocked` or `awaiting-decision` |
| `unknown` | same |

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
  "task": "<ID>",
  "gate": "<gate id>",
  "date": "2026-09-02",
  "owner": "claude-code",
  "command": "npm run test:operacao",
  "exit_code": 0,
  "sha": "<revision SHA>",
  "external_origin": null
}
```

Older evidence files keep the gate id of their time in the file name (for example
`documentacao-figma-aceita-2026-10-01.md`): the keys and the gate ids moved to
English in `DSA-15`, and the file names did not.

The path declared in `evidence[]` and in `gates[].evidence` is **from the
repository root** and must exist on disk; the file's `task` field must match the
ID that references it. A pointer that points to nothing does not raise an error on
its own — it just stops working. That is why the verifier opens the file.

### 5b. The evidence for the documentation gate

The `figma-docs-accepted` gate has a format of its own, because what it
proves is not the output of a command: it is a **human acceptance**. The evidence
lives in `evidencias/<ID>/`, in the tree itself, and the verifier enforces the
whole provenance (`V31`):

```json
{
  "task": "<ID>",
  "gate": "figma-docs-accepted",
  "date": "2026-09-10",
  "owner": "indiane",
  "command": null,
  "exit_code": null,
  "sha": null,
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "<URL or ID of the frame in Figma>",
    "date": "2026-09-10",
    "author": "<who recorded it>",
    "excerpt": null,
    "converted_decision": "<the accepted frame and the COMPONENT_SET that came out of it>"
  }
}
```

| What `V31` enforces | Why |
|---|---|
| `gate` is `figma-docs-accepted` | the evidence cannot serve another gate by mistake |
| `owner` is `indiane` | accepting documentation is her decision, not the agent's |
| `external_origin.classification` is `internal-allowed` | Figma is internal, and permitted: see §4 |
| `external_origin.url_or_id` names Figma | without the pointer, nobody can reopen the frame |
| `external_origin.date` in `AAAA-MM-DD`, and `author` | when, and by whom |
| `external_origin.converted_decision` names the **frame** and the **COMPONENT_SET** | it is the link between what was accepted and what will be built |
| the file is in `evidencias/<ID>/` | the proof is local and versioned, not a link that vanishes |

**Restricted Figma content is not copied here.** What goes in is the converted
decision — the requirement that came out of the frame —, not the frame's content.
It is the same rule as §4, applied to evidence.

## 6. Short context

`contextos/<ID>.md`. One per task, tied to a worktree, **rewritten on every
pass**. It does not accumulate a conversation diary.

```json
{
  "task": "<ID>",
  "worktree": "<worktree path>",
  "start_sha": "<SHA>",
  "end_sha": null
}
```

Below the block, eight fixed sections: goal of this pass, sources opened, changes,
commands run, result, evidence, blocker and next command.

**The context does not decide.** The keys `state`, `phase`, `approved_order`,
`priority`, `scope` and `decision` are forbidden in it — the only way to enforce
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
`src/shared/metadata/<piece>.json`. The file is never edited by hand: whoever
changes the spec generates it again in the same commit, and `V32` fails a copy that
does not match the spec.

**The spec is enforced at the end, not at the start.** `V28` only requires
`fichas/<piece>.md` in `in-review` and `done`. Before that, the piece may have
local code and no spec — see §2b.

## 8. The 32 verifier rules

Each error comes out with the code, the path and the message.

**Structure** · `V01` file name equal to the `id` · `V02` `id` matches the pattern
and is unique · `V03` the first JSON block exists, parses, and no top-level key is
outside the schema · `V04` required field present and not empty

**State** · `V05` `state` is one of the six · `V06` `done` with every gate
`passed` and existing evidence · `V07` `blocked` with an open blocker, `owner` and
`what_resolves` · `V08` `awaiting-decision` with `question` and `decider` ·
`V09` `ready` with all dependencies `done` · `V10` `in-review` with
`git_review.pr`

**Dependencies** · `V11` every cited ID exists · `V12` no cycle ·
`V13` no self-dependency

**Gates and evidence** · `V14` gate with `id`, `description` and `result` ·
`V15` `passed` gate with `evidence`, `verified_at` and `verified_by` ·
`V16` the evidence path exists on disk · `V17` the evidence's `task` field
matches the ID

**External origin** · `V18` classification is one of the four · `V19` restricted or
unknown without `excerpt`, and the task in `blocked` or `awaiting-decision` ·
`V20` permitted with the four fields · `V21` secret scan

**Context** · `V22` the context points to an existing task · `V23` closed set of
keys, without the six forbidden ones · `V24` at most 60 lines ·
`V25` `done` without context · `V26` `in-progress` with context, `worktree` and
`start_sha`

**Metadata contract** · `V27` no `meta.ts` or `metadata.ts` in
`src/components/` · `V28` `piece` filled in requires `fichas/<piece>.md` **in
`in-review` and `done`** · `V32` the Metadata in `src/shared/metadata/` is an
exact copy of each current spec, there is no JSON without a current spec, and the
spec fits the grammar of `scripts/spec-lib.mjs`

**Queue** · `V29` `approved_order` integer ≥ 1, unique among those not `done`

**Documentation lock** · `V30` a component task in `ready`, `in-progress`,
`in-review` or `done` requires the `figma-docs-accepted` gate with
`result: "passed"` · `V31` the evidence for that gate proves provenance: matching
`gate`, `owner` `indiane`, `external_origin` `internal-allowed` with the
Figma URL or ID, `date`, `author` and `converted_decision` naming the frame and the
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
