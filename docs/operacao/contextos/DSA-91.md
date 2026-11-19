```json
{
  "task": "DSA-91",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/zen-bouman-6bf303",
  "start_sha": "78074fb",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-rich-option` card and the rich look of the `nph-option` with a description in the `nph-select` and `nph-combobox` list, in the contract accepted in Figma: component, CSS, tests, stories, the sheets, the Storybook dictionary and the technical decision P134.

## Sources opened
- `docs/operacao/tarefas/DSA-91.md` and the evidence of the `figma-docs-accepted` gate (2026-11-18)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md`, `docs/stories.md`
- `src/components/nph-option/`, `nph-select/`, `nph-combobox/` (list), `nph-checkbox/`, `nph-radio/`, `nph-switch/`, `nph-field/`, `nph-kbd/` and their sheets
- `src/tokens/generated/tokens.css`: the 39 tokens of the task, all present

## Changes
- Started: `nph-rich-option` card; `rich`, `description` and the keyboard state on `nph-option`.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-91-rich-option origin/v/5.0.0`

## Result
In progress. No token created or changed.

## Evidence
None yet: the `review-and-merge` gate opens after the merge.

## Blocker
None.

## Next command
`npm test -- src/components/nph-option`
