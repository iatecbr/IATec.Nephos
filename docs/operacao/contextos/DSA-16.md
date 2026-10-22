```json
{
  "task": "DSA-16",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-16-nph-input-20ff0b",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-input` (component, CSS, stories, Docs page, tests, sheet, P80 and Metadata)
from the contract in the `figma-docs-accepted` evidence, as the first form-associated piece,
and add the `nph-input` example to the `nph-icon` Docs page (DSA-33, D2).

## Sources opened
- `docs/operacao/tarefas/DSA-16.md` and its evidence
- `docs/operacao/tarefas/DSA-28.md` and its evidence (the field that composes the input)
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence and rule 6
- `src/components/nph-togglebutton/`, `src/components/nph-label/`, `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P01, P02, P21, P62, P63, P71, P72, P73, P76, P77

## Changes
The task moves to in progress with the pending decisions D1 to D5. The component, its CSS,
tests, stories and sheet follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D1 to D5 wait for Indiane and do not block.

## Next command
Commit the component, then the stories, the Docs page and the sheet.
