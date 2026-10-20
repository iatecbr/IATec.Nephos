```json
{
  "task": "DSA-23",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-23-nph-toggle-group-5f3299",
  "start_sha": "a7ecf7e9bf411ee0efe5cf1242ebcbd006baaa70",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-toggle-group` (component, CSS, stories, Docs page, tests, sheet, P76 and
Metadata) from the contract in the `figma-docs-accepted` evidence, and add the six core
icons of D1.

## Sources opened
- `docs/operacao/tarefas/DSA-23.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — `space/inline`, `control/height-default` and the `icones_nucleo` block
- `src/components/nph-togglebutton/` and `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P21, P68, P73, P74, P75

## Changes
The task moves to in progress with the pending decisions D4 and D5. The icons, the
component, its CSS, tests, stories and sheet follow in the next commits. See the commits on
the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D4 and D5 wait for Indiane and do not block.

## Next command
Commit the six icons, then the component, the stories, the Docs page and the sheet.
