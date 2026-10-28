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
`page.ts` sets `text/body-lg` in `text` and `list`; the `nph-button` Docs page gains Anatomy and the
`plus` icon-only example of the frame; the `nph-icon` Docs page gains Anatomy and the other two
examples of the frame; the §4.10 sentence of D3 is corrected; tests and the three dictionaries.

## Commands run
- `git merge --ff-only origin/v/5.0.0`; Wait for the Copilot review of the pull request.
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:naming`,
  `test:spelling`, `test:operacao`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in pull request #137, from the branch `claude/dsa-33-docs-body-lg-2e2a78`.

## Evidence
The proof table is in the description of the pull request. `review-and-merge` waits for the
merge.

## Blocker
None.

## Next command
Wait for the Copilot review of the pull request.
