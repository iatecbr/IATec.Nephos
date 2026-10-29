```json
{
  "task": "DSA-55",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-55-toolbar-fd37bc",
  "start_sha": "efbd559ee9c3ccfae616d67d9cb21d42cba173c4",
  "end_sha": null
}
```

## Goal of this pass
Build `nph-toolbar` in the contract accepted in Figma: the bulk, page, tools and floating bars
and the applied filters strip, in three sizes, with the toolbar keyboard pattern of the W3C ARIA
Authoring Practices, tests, stories, the Storybook dictionary and the sheet.

## Sources opened
- `docs/operacao/tarefas/DSA-55.md` and `docs/operacao/evidencias/DSA-55/documentacao-figma-aceita-2026-10-28.md`
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` and `docs/operacao/component-handoff.md`
- `src/components/nph-toggle-group/`, `src/components/nph-button/`, `src/components/nph-chip/`,
  `src/components/nph-separator/`, `src/components/nph-checkbox/`, `src/components/nph-input/`
  and `src/components/nph-dropdown-menu/`
- `src/tokens/generated/tokens.css`: the `toolbar/*` tokens, `elevation/dropdown` and `text/label-md`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `feat/dsa-55-toolbar`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm test`
