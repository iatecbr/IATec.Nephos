```json
{
  "task": "DSA-69",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/docs-validacao-angular-rc2-806816",
  "start_sha": "43537e0",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-context-menu` in the contract accepted in Figma on 2026-11-06, and apply the accepted changes to `nph-dropdown-menu` (radii, separator, destructive item, solid icon on highlight, compact destructive item) and `nph-icon` (`arrow-pointer`).

## Sources opened
- `docs/operacao/tarefas/DSA-69.md` and `docs/operacao/evidencias/DSA-69/figma-docs-accepted-2026-11-06.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `fichas/nph-dropdown-menu.md`, `src/components/nph-dropdown-menu/` as the pattern; `nph-popover` and `nph-navigation-menu` for the object lookup and the hover delay
- `src/tokens/generated/tokens.css`: the `dropdown/*` tokens

## Changes
- `nph-dropdown-menu`: the tokens of the accepted item, panel, focus ring and separator; the destructive item; the start icon solid on hover and on visible focus; tests, sheet and Storybook dictionary.
- `nph-icon`: `arrow-pointer`, light and solid, with the one-word change of the `icones_nucleo` list in `design.md` that its test requires (its own commit).
- `nph-context-menu`: component, CSS, tests, Validation stories, Docs page, sheet, metadata and the dictionary in three languages.
- P113 in `docs/decisoes-tecnicas.md`; the pending decisions D-1 to D-5 in the task.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-69-context-menu origin/v/5.0.0`
- The twelve proofs of the wave, in sequence, on the head of the pull request.

## Result
The task is in review on the branch `feat/dsa-69-context-menu`.

## Evidence
None yet. `review-and-merge` waits for the merge.

## Blocker
None.

## Next command
`gh pr edit <number> --add-reviewer @copilot`
