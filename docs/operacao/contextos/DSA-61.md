```json
{
  "task": "DSA-61",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/zealous-golick-455ac2",
  "start_sha": "49673937b99f0627a9ac0a003b7447cdfb729b75",
  "end_sha": null
}
```

## Goal of this pass
Make `nph-togglebutton` and `nph-toggle-group` follow the contract accepted in Figma on
2026-10-29: the sizes `compact`, `default` and `large`, the new rest, hover and checked
states on the `togglebutton/*` tokens, the solid icon on checked and on hover, and one icon
at most, with tests, stories and both specs updated.

## Sources opened
- `docs/operacao/tarefas/DSA-61.md` and `docs/operacao/evidencias/DSA-61/figma-docs-accepted-2026-10-29.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-togglebutton/`, `src/components/nph-toggle-group/`, `fichas/nph-togglebutton.md` and `fichas/nph-toggle-group.md`
- `src/tokens/source/semantic.tokens.json`: `togglebutton/background-hover`,
  `togglebutton/background-checked` and `togglebutton/background-checked-hover`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-61-togglebutton-size-states`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm ci`
