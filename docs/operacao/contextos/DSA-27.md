```json
{
  "task": "DSA-27",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-27-nph-switch-1ea737",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-switch` in the contract of the `figma-docs-accepted` evidence: the track with
the sliding knob, the label after it, focus on the track, error, disabled and reduced motion.
Write its sheet, the Metadata and P79.

## Sources opened
- `docs/operacao/tarefas/DSA-27.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — the switch, input, primary, focus and motion tokens
- `docs/decisoes-tecnicas.md` — P73, P76
- `src/components/nph-togglebutton/` and `src/components/nph-toggle-group/`

## Changes
The task moves to in progress with the pending decisions D5 and D6. The component, the
stories, the sheet and P79 follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D5 and D6 wait for Indiane and do not block.

## Next command
Commit the switch component, then the stories, the Docs page, the sheet and P79.
