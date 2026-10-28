```json
{
  "task": "DSA-33",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-33-docs-body-lg-2e2a78",
  "start_sha": "600d0f5aad97743137c7b47682cc30a90126178e",
  "end_sha": null
}
```

## Goal of this pass
Set `text/body-lg` in the `text` and `list` blocks of `src/shared/docs/page.ts`, add Anatomy to the
`nph-button` Docs page and Anatomy and the two remaining Examples to the `nph-icon` Docs page, from the
accepted frames `1197:5449` and `1130:956`, in the order of `docs/stories.md`, §4.10 (D1 to D3).

## Sources opened
- `docs/operacao/tarefas/DSA-33.md` and `DSA-30.md` (D6 and D7)
- `AGENTS.md`, `CLAUDE.md`, `GOVERNANCA.md`, `design.md` §2b and `docs/stories.md` §4.10
- `src/shared/docs/page.ts` and `page.test.ts`
- `src/components/nph-button/` and `src/components/nph-icon/` Docs stories and tests
- `fichas/nph-button.md` and `fichas/nph-icon.md`

## Changes
None yet.

## Commands run
- `git merge --ff-only origin/v/5.0.0`

## Result
The task is in progress on the branch `claude/dsa-33-docs-body-lg-2e2a78`.

## Evidence
None yet. `review-and-merge` waits for the pull request.

## Blocker
None.

## Next command
`npm ci`
