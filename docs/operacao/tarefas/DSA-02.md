```json
{
  "id": "DSA-02",
  "goal": "Record in the technical contract the approved uses of status/error and space/inline-tight for form fields.",
  "phase": "F1",
  "approved_order": 90,
  "owner": "claude-code",
  "state": "done",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "PR #33 was reviewed by maurocsjr and merged into v/5.0.0; commit 8903873 is an ancestor of merge 8e11751.",
      "command": "git merge-base --is-ancestor 89038735f968a1abbcc629cdde02097d3041454a origin/v/5.0.0",
      "evidence": "docs/operacao/evidencias/DSA-02/revisao-e-merge-2026-09-14.md",
      "result": "passed",
      "verified_at": "2026-09-14",
      "verified_by": "copilot"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-02/revisao-e-merge-2026-09-14.md"
  ],
  "decision_refs": [],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "WORK BRAIN — 03 MEMÓRIA/decisoes/2026-09-03-tres-decisoes-visuais-do-nph-input.md; 03 MEMÓRIA/agentes/2026-09.md, record of 2026-09-03 about space/inline",
    "date": "2026-09-03",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "status/error covers the border of an invalid field and space/inline-tight covers the icon and text pair inside a control; on 09-09-2026 Indiane authorized migrating DSA-02 to docs/operacao/tarefas/ as a comparable M6 cycle."
  },
  "git_review": {
    "branch": "docs/dsa02-status-error-inline-tight",
    "commit": "89038735f968a1abbcc629cdde02097d3041454a",
    "pr": "33"
  },
  "context": null,
  "updated_at": "2026-09-14"
}
```

# DSA-02 — record token uses in a field

## Goal
The technical contract records that `status/error` covers the border of an invalid
field and `space/inline-tight` covers the icon and text pair inside a control.

## How it is proved
**`review-and-merge`** — the approved uses are recorded without changing the value,
alias, CSS name or `nao_use` of the tokens; the change passes the applicable tests,
review and merge into the default branch. The evidence must record branch, commit,
PR, the command run and the result.

## What this task does not do
It does not change values or aliases, does not create a token and does not change
the Figma scopes of `status/error`. Widening `STROKE_COLOR` remains a separate
change in Figma, already authorized by Indiane.

## Sources
- `design.md`
- `docs/tokens.md`
- `docs/operacao/README.md`
- `GOVERNANCA.md`, `AGENTS.md`, `CLAUDE.md`
- WORK BRAIN — `03 MEMÓRIA/decisoes/2026-09-03-tres-decisoes-visuais-do-nph-input.md`
- WORK BRAIN — `03 MEMÓRIA/agentes/2026-09.md`, record of 2026-09-03 about `space/inline`

## Why it is `done`
PR #33 was reviewed by Mauro (`maurocsjr`) and merged into `v/5.0.0` on
14-09-2026, in merge commit `8e11751`. Commit `8903873`, which recorded the
approved uses, is an ancestor of the default branch after the merge. The only gate
is `passed`, with local evidence, date and owner, and there is no active context.
