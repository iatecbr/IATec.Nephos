```json
{
  "task": "DSA-41",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-41-nph-input-otp-d795bb",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-input-otp`, the short code field with one cell per character, in the contract of
the `figma-docs-accepted` evidence, with its stories, Docs page, sheet, Metadata and decision P85.

## Sources opened
- `docs/operacao/tarefas/DSA-41.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — the tokens named in the evidence, `color/link` included
- `docs/decisoes-tecnicas.md` — P68, P72, P73, P76
- `src/components/nph-togglebutton/`, `src/components/nph-toggle-group/`, `src/components/nph-tooltip/`

## Changes
The task moves to in progress with the pending decisions D1 to D4, and records the follow-up for the
two examples that wait for the `nph-field`. The component, the stories, the sheet and P85 follow in
the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D1 to D4 wait for Indiane and do not block. The pull request opens after DSA-28 is merged.

## Next command
Commit the component, then the stories, the Docs page, the sheet and P85.
