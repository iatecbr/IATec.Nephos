```json
{
  "task": "DSA-57",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-17-nph-checkbox-4f2a40",
  "start_sha": "b62e8b2",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-chip` (component, CSS, tests, stories, Docs page, sheet, P100 and
Metadata), from the contract in the `figma-docs-accepted` evidence, with `nph-icon`,
`nph-avatar` and the `nph-tooltip` of P77.

## Sources opened
- `docs/operacao/tarefas/DSA-57.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-togglebutton/` (P73), `src/components/nph-sidebar-item/` (P98),
  `src/components/nph-badge/` (P68), `src/components/nph-avatar/` (P74),
  `src/components/nph-tooltip/` (P77), `src/components/nph-table/` (P97),
  `src/components/nph-multi-combobox/` (P96), `src/components/nph-pagination/` (P99)
- `docs/decisoes-tecnicas.md` — P01, P02, P03, P21, P73, P77, P96, P97, P98, P99

## Changes
`nph-chip` (component, CSS, tests), six Validation stories, the Docs page, the
dictionaries in the three languages, the sheet and its Metadata, and P100. See the
commits on the branch.

## Commands run
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`,
  `test:operacao`, `test:naming`, `build-storybook`, `build:lib`, `test:package` and
  `git diff --check` on the head of the pull request.

## Result
In review in PR #134.

## Evidence
The proof table is in the description of PR #134. `review-and-merge` waits for the merge.

## Blocker
None. D-1 to D-5 wait for Indiane and do not block.

## Next command
Wait for the review of PR #134.
