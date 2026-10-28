```json
{
  "id": "DSA-56",
  "goal": "Make the nph-table tree a treegrid with the APG keyboard, so its rows carry aria-level where ARIA allows it, and remove the accessibility exception of its stories.",
  "phase": "F4",
  "approved_order": 550,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-table",
  "dependencies": ["DSA-49", "DSA-32"],
  "gates": [
    {
      "id": "review-and-merge",
      "description": "The tree of nph-table is a treegrid with the APG keyboard, recorded in a new technical decision, the exception TREE_LEVEL_EXCEPTION is gone from the stories, the accessibility gate passes without it, the proof commands pass and the pull request is merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p97, known limit: aria-level on a row outside a treegrid",
    "docs/decisoes-tecnicas.md#p72",
    "Elvys, 27-10-2026, DSA-32: exception in the stories plus a task to move the tree to treegrid"
  ],
  "external_origin": null,
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-28"
}
```

# DSA-56 — nph-table: the tree as a treegrid

## Goal
The tree of `nph-table` has `role="treegrid"` and the keyboard of the APG treegrid pattern, its
rows carry `aria-level` where ARIA 1.2 allows it, and the stories that draw a tree run the
accessibility gate (P72) with no exception.

## How it is proved
**`review-and-merge`** passes when a new technical decision records the treegrid contract
(roles, focus, keys, what the flat table keeps); `TREE_LEVEL_EXCEPTION` is gone from
`nph-table.demo.ts`, `nph-table.stories.ts` and `nph-table.docs.stories.ts`; `npm test` exits 0
with the gate on every story; the keyboard is covered by tests; the sheet and the Metadata say
the same; the proof commands of `docs/operacao/component-handoff.md` pass; and the pull request
is merged into `v/5.0.0`.

## What this task does not do
It does not change the flat table, the look of the rows or any token. It does not add sorting,
selection or filtering (`nph-data-table`). It does not open another accessibility exception.

## Sources
- `src/components/nph-table/` — the piece, its stories, its demo and its tests
- `fichas/nph-table.md`
- `docs/decisoes-tecnicas.md` — P97 and P72
- `docs/stories.md` — §2.3 and §5.6
- `docs/operacao/tarefas/DSA-32.md`
