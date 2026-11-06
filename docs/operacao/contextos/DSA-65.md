```json
{
  "task": "DSA-65",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-46-nph-combobox-43fc0a",
  "start_sha": "d82f4c38b707844bf672f403dd8c4f10910e4cc4",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-progress` in the contract accepted in Figma on 2026-11-05: the determinate, indeterminate and
steps types, the md and sm sizes, the active, success and error status, the optional label, value text and
help text, and the status icon, with tests, stories and the spec.

## Sources opened
- `docs/operacao/tarefas/DSA-65.md` and `docs/operacao/evidencias/DSA-65/figma-docs-accepted-2026-11-05.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-spinner/`, `nph-skeleton/` and `nph-slider/` as patterns
- `src/tokens/generated/tokens.css`: the `progress/*` tokens and `motion/loop-long-*`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-65-progress`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
