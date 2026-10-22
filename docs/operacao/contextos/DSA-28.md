```json
{
  "task": "DSA-28",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-28-nph-field-66625a",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-field` (component, CSS, stories, Docs page, tests, sheet, P83 and
Metadata) from the contract in the `figma-docs-accepted` evidence, with the field–control
contract that the form controls of DSA-16, DSA-17, DSA-18, DSA-27 and DSA-41 implement.

## Sources opened
- `docs/operacao/tarefas/DSA-28.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — `layout/field-width`, `space/stack-tight`, `space/inline-tight`,
  `text/caption`, `text/body-md`, `color/muted-foreground`, `status/error`,
  `state/disabled-opacity`
- `src/components/nph-label/`, `src/components/nph-tooltip/`,
  `src/components/nph-toggle-group/` and `src/components/nph-togglebutton/`
- `docs/decisoes-tecnicas.md` — P01, P02, P21, P62, P72, P76, P77

## Changes
The task moves to in progress with the pending decisions D-1 to D-5. The component, its
CSS, tests, stories and sheet follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block. The pull request opens after DSA-16
(`nph-input`) is merged, so the stories use the real control.

## Next command
Commit the component, then the stories, the Docs page and the sheet.
