```json
{
  "task": "DSA-25",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-25-nph-avatar-stack-8e424e",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-avatar-stack` in the contract of the `figma-docs-accepted` evidence: a row of
`nph-avatar` children overlapped by `avatar/overlap`, with the "+N" count, a single size and one
accessible name for the group. Write the sheet, the Metadata and P78.

## Sources opened
- `docs/operacao/tarefas/DSA-25.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`
- `design.md` — avatar, color, text, space and border tokens
- `docs/decisoes-tecnicas.md` — P21, P74, P76, P77
- `src/components/nph-avatar/` and `src/components/nph-toggle-group/`

## Changes
The group, the stories, the Docs page, the sheet, the Metadata and P78 are done and in the pull
request. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.

## Result
In review in PR 96, synced with `v/5.0.0` after PR 97. The proof commands pass, except
`test:naming`, whose findings are all in files this branch does not touch.

## Evidence
None recorded: `review-and-merge` waits for the merge.

## Blocker
None. D4 waits for Indiane and does not block.

## Next command
Wait for the review; after the merge, record the `review-and-merge` evidence and move the task to done.
