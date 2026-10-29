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
- `nph-togglebutton`: `size`, the new rest, hover and checked states on `togglebutton/*`,
  the solid icon on checked and on hover, and one icon at most (`icon-end` defaults to `none`).
- `nph-toggle-group`: `size`, written on every button.
- Tests, Validation and Docs stories, dictionaries, both specs, the P73 and P76 amendments.

## Commands run
- `git merge --ff-only origin/v/5.0.0`
- The proofs of `docs/operacao/component-handoff.md`, plus `build:lib` and `test:package`, on `9781ba2`: all exit 0.

## Result
Pull request #145 is open to `v/5.0.0`, under the Copilot review.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`gh pr view 145 --json reviews`
