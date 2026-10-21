```json
{
  "task": "DSA-42",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-42-nph-tooltip-466e67",
  "start_sha": "effb1ccc19a5fd11eafc804883a21b72f51c38cc",
  "end_sha": null
}
```

## Goal of this pass
Update `nph-tooltip` and the balloon of `nph-label` to the contract in the `figma-docs-accepted`
evidence: any element, opened on hover and keyboard focus, Esc closes, no touch opening, four sides
with flip, enter 250 ms and exit 150 ms. Update both sheets, the Metadata and the decisions.

## Sources opened
- `docs/operacao/tarefas/DSA-42.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — tooltip tokens and the motion roles
- `docs/decisoes-tecnicas.md` — P62.6, P65, P70, P75, P76
- `src/components/nph-tooltip/` and `src/components/nph-label/`

## Changes
The task moves to in progress with the pending decisions D2 to D7. The component, the label, the
stories, the sheets and P77 follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D2 to D7 wait for Indiane and do not block.

## Next command
Commit the tooltip component, then the label, the stories, the Docs page and the sheets.
