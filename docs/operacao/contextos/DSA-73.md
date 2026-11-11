```json
{
  "task": "DSA-73",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-73-stepper-b8dc01",
  "start_sha": "1b98a1d77f58d40533eaea832d256efe9d77fa17",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-stepper` in the contract accepted in Figma on 2026-11-10: the steps of a process in order, from two to seven, with the current one marked and the completed, pending and error ones, linear by default and non-linear as an option, with tests, stories and the spec. The horizontal stepper only: the vertical one waits for `nph-collapsible`.

## Sources opened
- `docs/operacao/tarefas/DSA-73.md` and `docs/operacao/evidencias/DSA-73/figma-docs-accepted-2026-11-10.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-breadcrumb/`, `nph-progress/` and `nph-tabs/` as patterns; the sheets of `nph-icon`, `nph-tooltip` and `nph-progress`
- `src/tokens/generated/tokens.css`: the `stepper/*` tokens

## Changes
Component, CSS and tests of `nph-stepper`.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-73-stepper origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-73-stepper`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
