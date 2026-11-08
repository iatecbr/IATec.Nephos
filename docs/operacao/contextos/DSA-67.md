```json
{
  "task": "DSA-67",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/great-lederberg-b20e44",
  "start_sha": "a3414a195d8636b5c2dab46c4f468a701b888884",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-popover` in the contract accepted in Figma on 2026-11-06: the non-modal surface anchored to a trigger, on four sides and three alignments, with an optional arrow, in three widths, with optional description, body, close button and footer; move the `nph-field` error message to the `status/error-text` token.

## Sources opened
- `docs/operacao/tarefas/DSA-67.md` and `docs/operacao/evidencias/DSA-67/figma-docs-accepted-2026-11-06.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-dropdown-menu/` and `nph-dialog/` as patterns (top layer, trigger lookup, focus rule); `nph-breadcrumb/` for stories and Docs
- `src/tokens/generated/tokens.css`: the `popover/*` tokens

## Changes
None yet.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-67-popover origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-67-popover`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm run test:operacao`
