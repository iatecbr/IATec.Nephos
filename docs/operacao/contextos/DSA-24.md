```json
{
  "task": "DSA-24",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-24-nph-avatar-9feadc",
  "start_sha": "e09a8311758360a379e0d18c85a350b4f4db3392",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-avatar` (component, CSS, stories, Docs page, tests, sheet, P74 and
Metadata) from the contract in the `figma-docs-accepted` evidence.

## Sources opened
- `docs/operacao/tarefas/DSA-24.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the avatar, icon and border tokens named in the evidence
- `fichas/nph-skeleton.md`, `src/components/nph-icon/` and `src/components/nph-togglebutton/`
- `docs/decisoes-tecnicas.md` — P21, P66, P68, P73

## Changes
The task moves to in progress with the pending decision D5. The component, its CSS and
tests follow in the next commits. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In progress. Nothing delivered yet beyond the task state.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D5 (`use` text of the tokens in `design.md`) waits for Indiane and does not block.

## Next command
Commit the component, then the stories, the Docs page and the sheet.
