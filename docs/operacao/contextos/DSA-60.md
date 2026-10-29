```json
{
  "task": "DSA-60",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/eloquent-ritchie-81c3fa",
  "start_sha": "8b49b0ce78dd46db4a60a989b481c06896a11500",
  "end_sha": null
}
```

## Goal of this pass
Make the hover of the secondary ghost `nph-button`, with text and icon only, read
`button/secondary-ghost-background-hover` and `icon-button/secondary-ghost-background-hover`, with
tests, stories and the spec updated, in the contract converted to text in the evidence of the
`figma-docs-accepted` gate.

## Sources opened
- `docs/operacao/tarefas/DSA-60.md` and `docs/operacao/evidencias/DSA-60/figma-docs-accepted-2026-10-29.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-button/` and `fichas/nph-button.md`
- `src/tokens/source/semantic.tokens.json`: `button/secondary-ghost-background-hover` and
  `icon-button/secondary-ghost-background-hover`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-60-button-ghost-hover`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm ci`
