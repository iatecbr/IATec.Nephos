```json
{
  "task": "DSA-63",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-48-nph-tooltip-ajuste-62075c",
  "start_sha": "dd9772d52da51c2eb2e6c142f4c7444f7dd08d10",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-notification` in the contract accepted in Figma: inline and toast placement, the
seven severities, subtle and solid emphasis, stacked and single-line layout, the optional
title, the actions, the close button and the time bar, with tests, stories, the Storybook
dictionary and the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-63.md` and `docs/operacao/evidencias/DSA-63/figma-docs-accepted-2026-11-04.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-button/`, `src/components/nph-dialog/`, `src/components/nph-empty/`,
  `src/components/nph-icon/`, `src/components/nph-spinner/` and `src/components/nph-skeleton/`
- `src/tokens/generated/tokens.css`: the `notification/*` tokens, `elevation/modal` and the
  focus tokens

## Changes
None yet.

## Commands run
- `git fetch origin` and `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-63-notification`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blockers
None.

## Next command
`npx vitest run --project unit src/components/nph-notification`
