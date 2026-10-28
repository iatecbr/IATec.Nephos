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
The task moves to in progress. See the commits on the branch.

## Commands run
- `node scripts/verificar-operacao.mjs` before the commit.

## Result
In progress.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None.

## Next command
Commit the treegrid, its tests, the stories without the exception, P101 and the sheet.
