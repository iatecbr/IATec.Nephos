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
- `nph-button`: secondary solid and outline on the ten component tokens; no secondary light; `secondary light` is invalid input.
- `nph-table`: three secondary light compact buttons became secondary solid compact.
- `nph-dialog`: redefines the four new solid secondary tokens with `color/secondary-on-dialog` (P87); D-1 for Indiane.
- Sheets of the button, table and dialog, Storybook dictionary, `docs/decisoes-tecnicas.md`, generated metadata.

## Commands run
- Every proof of the pull request, in sequence, on the head before the review round.

## Result
Pull request 148 is open against `v/5.0.0`, with the Copilot review requested. The task is in review.

## Evidence
None yet. `review-and-merge` waits for the merge.

## Blocker
None. D-1 (the dialog overlay) does not block the pull request.

## Next command
`gh pr view 148`
