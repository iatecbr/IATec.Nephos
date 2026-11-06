```json
{
  "task": "DSA-66",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-23-followup-316fe8",
  "start_sha": "37e50273830affb5837589046c44404c27374940",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-breadcrumb` in the contract accepted in Figma on 2026-11-06: the trail with 2, 3 or 4 levels or collapsed, with or without icons; the item as link or current page; the ellipsis button that opens the hidden levels in an `nph-dropdown-menu`; and the separator between levels, with tests, stories and the spec.

## Sources opened
- `docs/operacao/tarefas/DSA-66.md` and `docs/operacao/evidencias/DSA-66/figma-docs-accepted-2026-11-06.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-progress/`, `nph-sidebar-item/` and `nph-dropdown-menu/` as patterns
- `src/tokens/generated/tokens.css`: the `breadcrumb/*` tokens

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-66-breadcrumb`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
