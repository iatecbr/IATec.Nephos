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
The component, CSS and tests; the Validation stories, the Docs page and the dictionary;
the sheet, the Metadata and P74. See the commits on the branch.

## Commands run
- `npm ci`, then `npm run test:operacao` before the first commit.
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:operacao`,
  `build-storybook` and `git diff --check`: exit 0
- `npm run test:naming`: exit 1, only on `DSA-34.md` and `DSA-39.md`, which this pass does not touch

## Result
The deliverable is complete and open in PR 90, targeting `v/5.0.0`, with review requested from `maurocsjr`.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D5 (`use` text of the tokens in `design.md`) waits for Indiane and does not block.

## Next command
Review and merge of PR 90; then close the task with the `review-and-merge` evidence.
