```json
{
  "task": "DSA-90",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/objective-panini-10f802",
  "start_sha": "9fff53d",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-date-picker` and its date grid `nph-calendar` in the contract accepted in Figma: components, CSS, tests, stories, the specs `fichas/nph-date-picker.md` and `fichas/nph-calendar.md`, the Storybook dictionary and the technical decision P133.

## Sources opened
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md`, `docs/operacao/component-handoff.md`, `docs/stories.md`
- `docs/operacao/tarefas/DSA-90.md` and the evidence of the `figma-docs-accepted` gate (2026-11-17)
- The sheets `fichas/nph-field.md`, `nph-input.md`, `nph-button.md`, `nph-option.md`, `nph-select.md`, `nph-separator.md`, `nph-popover.md`, `nph-tooltip.md` and `nph-scheduler.md`
- `src/tokens/generated/tokens.css`: the nine `calendar/*` and `date-picker/*` tokens and the focus, elevation, motion and text tokens, all present

## Changes
- `src/components/nph-calendar/` and `src/components/nph-date-picker/`: the components, their CSS, tests, demonstration frames, Validation stories and Docs pages.
- `fichas/nph-calendar.md`, `fichas/nph-date-picker.md` and their generated Metadata; P133 in `docs/decisoes-tecnicas.md`; the dictionary keys.
- Pending decisions D-1 to D-11 stay with the design owner; the code follows the provisional rule of each one.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-90-date-picker origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
Pull request 186 open, in review. No token created or changed.

## Evidence
None yet: the `review-and-merge` gate opens after the merge.

## Blocker
None.

## Next command
`gh pr checks 186 --watch`
