```json
{
  "task": "DSA-88",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/heuristic-banach-6b873e",
  "start_sha": "e0e5214",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-card` in the contract accepted in Figma: component, CSS, tests, stories, the spec `fichas/nph-card.md`, the Storybook dictionary and the technical decision P130.

## Sources opened
- `docs/operacao/tarefas/DSA-88.md` and the evidence of the `figma-docs-accepted` gate (2026-11-17)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `docs/operacao/component-handoff.md` and `docs/stories.md`
- The sheets `fichas/nph-button.md`, `nph-icon.md`, `nph-image.md`, `nph-avatar.md`, `nph-badge.md`, `nph-separator.md`, `nph-skeleton.md` and `nph-dropdown-menu.md`
- `src/tokens/generated/tokens.css`: the 30 `card/*` tokens and the focus, elevation and text tokens, all present
- `design.md`: the `use` of the card tokens and the focus and elevation rules

## Changes
- `src/components/nph-card/`: the component, its CSS, the browser test, the demonstration frame, the Validation stories, the Docs page and its test.
- `fichas/nph-card.md` and its generated Metadata; P130 in `docs/decisoes-tecnicas.md`; the dictionary keys `cardValidation` and `cardDocs`.
- Pending decisions D-1 to D-4 in the task, for the design owner.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-88-card origin/v/5.0.0`
- The proofs of the wave, in sequence, on the head of the pull request.

## Result
Pull request open, in review. No token created or changed.

## Evidence
None yet: the `review-and-merge` gate opens after the merge.

## Blocker
None.

## Next command
`gh pr checks <number> --watch`
