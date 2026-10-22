```json
{
  "task": "DSA-48",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-48-nph-tooltip-ajuste-62075c",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Adjust `nph-tooltip`, its sheet and the balloon of `nph-label` to the six rules in the
`figma-docs-accepted` evidence: 300 ms on hover (`motion/hover-delay`), none on focus, Enter and
Space leave the balloon alone, only focusable elements, the balloon as the accessible name of an
icon-only button, and the touch exception. Fix the three Copilot findings left in PR #94.

## Sources opened
- `docs/operacao/tarefas/DSA-48.md` and its evidence; `docs/operacao/tarefas/DSA-42.md` (D2 to D7)
- `docs/operacao/evidencias/DSA-42/review-and-merge-2026-10-22.md` and the PR #94 reviews
- `docs/decisoes-tecnicas.md` — P77; `design.md` — `motion/hover-delay`
- `src/components/nph-tooltip/` and `src/components/nph-label/`

## Changes
The task moves to in progress with D2 open for Indiane. The component, the tests, the label, the
stories, the sheets and the amendment of P77 follow in the next commits.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D2 waits for Indiane and does not block.

## Next command
Commit the tooltip component and its tests, then the label, the stories and the sheets.
