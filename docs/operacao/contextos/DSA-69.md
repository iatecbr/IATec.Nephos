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
- `fichas/nph-dropdown-menu.md`, `src/components/nph-dropdown-menu/` as the pattern; `nph-popover` and `nph-navigation-menu` for the trigger lookup and the hover delay
- `src/tokens/generated/tokens.css`: the `dropdown/*` tokens

## Changes
None yet.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-69-context-menu origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-69-context-menu`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
