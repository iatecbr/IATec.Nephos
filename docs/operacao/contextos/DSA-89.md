```json
{
  "task": "DSA-89",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/wizardly-tu-6605a2",
  "start_sha": "9fff53d",
  "end_sha": null
}
```

## Goal of this pass
Implement the `nph-timeline` in the contract accepted in Figma: component, CSS, tests, stories, the spec `fichas/nph-timeline.md`, the Storybook dictionary and the technical decision P132.

## Sources opened
- `docs/operacao/tarefas/DSA-89.md` and the evidence of the `figma-docs-accepted` gate (2026-11-17)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` (the `timeline/*` passages), `docs/operacao/component-handoff.md` and `docs/stories.md`
- The sheets `fichas/nph-separator.md`, `nph-icon.md`, `nph-avatar.md`, `nph-button.md`, `nph-skeleton.md`, `nph-empty.md` and `nph-stepper.md`
- `src/tokens/generated/tokens.css`: the 27 `timeline/*` tokens and the text and icon tokens, all present
- `src/components/nph-stepper/` and `nph-card/`, as the shape of the code, the tests, the stories and the Docs page

## Changes
None yet.

## Commands run
- `git fetch origin && git checkout -B feat/dsa-89-timeline origin/v/5.0.0`

## Result
Work started.

## Evidence
None yet: the `review-and-merge` gate opens after the merge.

## Blocker
None.

## Next command
`npx vitest run src/components/nph-timeline`
