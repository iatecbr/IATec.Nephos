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
- The code of `nph-option`, `nph-select`, `nph-combobox` (and its list module and list CSS), `nph-multi-combobox` (the parts that handle the active option and the pointer), `nph-checkbox`, `nph-radio`, `nph-switch`, `nph-field` and `nph-kbd`
- The sheets of `nph-option`, `nph-radio` and `nph-checkbox` (feedback and focus, keyboard), and the relevant passages of the sheets of `nph-field`, `nph-select`, `nph-combobox`, `nph-multi-combobox` and `nph-kbd`; the sheets of `nph-switch`, `nph-avatar` and `nph-icon` were read only for the keyboard, the API and the use of the piece, not in full
- `design.md` was not opened: the tokens were taken from the evidence and checked against the generated CSS
- The passages of P82, P83, P91, P92 and P96 that P134 cites were read through the code and the sheets that carry them
- `src/tokens/generated/tokens.css`: the 39 tokens of the task, all present

## Changes
- `nph-rich-option` card, its CSS, tests, stories, Docs page and sheet; `rich`, `description` and `keyboard` on `nph-option` (its own CSS file); the keyboard and pointer state in `nph-select`, `nph-combobox` and `nph-multi-combobox`; `rich` and `description` in the combobox entries; one line in `nph-radio` (an inert radio does not warn); P134; D-4.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-91-rich-option origin/v/5.0.0`

## Result
Pull request 187 open, in review. No token created or changed.

## Evidence
None yet: the `review-and-merge` gate opens after the merge.

## Blocker
None.

## Next command
`gh pr checks 187 --watch`
