```json
{
  "task": "DSA-64",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-45-nph-dropdown-menu-6256e3",
  "start_sha": "d82f4c38b707844bf672f403dd8c4f10910e4cc4",
  "end_sha": null
}
```

## Goal of this pass
Make the secondary solid and secondary outline `nph-button`, with text and icon only, read the ten new
component tokens; remove the secondary light emphasis; move the secondary light compact buttons of
`nph-table` to secondary solid compact; update tests, stories, the sheets, the metadata and the Storybook dictionary.

## Sources opened
- `docs/operacao/tarefas/DSA-64.md` and `docs/operacao/evidencias/DSA-64/figma-docs-accepted-2026-11-04.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-button/`, `src/components/nph-table/`, `src/components/nph-dialog/nph-dialog.css`
- `fichas/nph-button.md`, `fichas/nph-table.md`

## Changes
None yet.

## Commands run
- `git fetch origin` and `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-64-secondary-buttons`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None for the code. `nph-dialog` redefines `color/secondary` for the solid secondary button; the new token no longer
follows that redefinition. Under check, then a question to the orchestrator.

## Next command
`npm test`
