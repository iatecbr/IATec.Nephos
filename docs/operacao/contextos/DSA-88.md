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
- `src/components/nph-card/`: the component, its CSS and its test in a real browser.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-88-card origin/v/5.0.0`

## Result
In progress: the component and its test are in; stories, sheet, dictionary and P130 follow.

## Evidence
None yet: the `review-and-merge` gate opens with the pull request.

## Blocker
None.

## Next command
`npx vitest run --project unit src/components/nph-card/nph-card.test.ts`
