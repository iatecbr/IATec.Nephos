```json
{
  "task": "DSA-58",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/sweet-ritchie-681a57",
  "start_sha": "29f9418f667f1f2e9257662a67f0c59aed624428",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-data-table` in the contract accepted in Figma: the table to search, sort, select and
act on records, built on nph-table, with the nph-toolbar above it, the bulk bar in its place
while rows are selected, row actions in an nph-dropdown-menu, the ajuste column with an
nph-switch and the footer with nph-pagination; with tests, stories, the Storybook dictionary and
the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-58.md` and `docs/operacao/evidencias/DSA-58/documentacao-figma-aceita-2026-10-28.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-table/`, `src/components/nph-toolbar/`, `src/components/nph-pagination/`,
  `src/components/nph-dropdown-menu/`, `src/components/nph-checkbox/` and the sheets of the pieces it uses
- `src/tokens/generated/tokens.css`: the `data-table/*` and `table/*` tokens

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-58-data-table`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm test`
