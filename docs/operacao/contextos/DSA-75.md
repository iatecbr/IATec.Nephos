```json
{
  "task": "DSA-75",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/funny-darwin-e93804",
  "start_sha": "7ea3244",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-tree` in the contract accepted in Figma on 2026-11-11: a list of items in levels where each branch opens and closes and the person chooses one item or several, in the three selections (none, single, multiple), with the first load, the load on demand with its error row and the empty tree, with tests, stories and the spec. The Tree Select and the Tree Table are other pieces and the tree of `nph-table` does not change.

## Sources opened
- `docs/operacao/tarefas/DSA-75.md` and `docs/operacao/evidencias/DSA-75/figma-docs-accepted-2026-11-11.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-stepper/`, `nph-table/`, `nph-dropdown-menu/` and `nph-checkbox/` as patterns; the sheets of `nph-checkbox` and `nph-context-menu`
- `src/tokens/generated/tokens.css`: the `tree/*` tokens

## Changes
Component, CSS and tests of `nph-tree`; the stories (Validation), the Docs page, the dictionaries in three languages, the sheet `fichas/nph-tree.md` with its Metadata, and P118 in `docs/decisoes-tecnicas.md`.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-75-tree origin/v/5.0.0`
- `npm ci`

## Result
The task is in progress on the branch `feat/dsa-75-tree`. Nothing is written yet besides this record.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npx vitest run --project unit src/components/nph-tree`
