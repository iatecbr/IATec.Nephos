```json
{
  "task": "DSA-56",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-31-nph-multi-combobox-4b7aff",
  "start_sha": "c501b59",
  "end_sha": null
}
```

## Goal of this pass
Make the tree of `nph-table` a `treegrid` with the keyboard of the APG treegrid pattern, so
its rows carry `aria-level` where ARIA 1.2 allows it; remove `TREE_LEVEL_EXCEPTION` from the
stories; record the contract in P101; and make the sheet and the Metadata say the same.

## Sources opened
- `docs/operacao/tarefas/DSA-56.md` and `docs/operacao/tarefas/DSA-32.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md`, `docs/stories.md` (§2.3 and §5.6)
- `docs/decisoes-tecnicas.md` — P72 and P97
- `src/components/nph-table/`, `fichas/nph-table.md`, `src/shared/metadata/nph-table.json`
- The WAI-ARIA Authoring Practices treegrid pattern

## Changes
The tree of `nph-table` is a `treegrid` with the APG keyboard (P101), the exception is gone from
the stories, and the sheet, the Metadata and the dictionaries say the same. Pull request #135.

## Commands run
- `node scripts/verificar-operacao.mjs` before the commit.

## Result
In review: the proof commands pass on `550383b`.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None.

## Next command
Answer the Copilot review of pull request #135.
