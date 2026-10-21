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
The six core icons; the component, CSS and tests; the Validation stories, the Docs page and
the dictionary; the sheet, the Metadata and P76; the widened tag pattern of the package
checks. See the commits on the branch.

## Commands run
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:operacao`,
  `build-storybook` and `git diff --check`: exit 0
- `npm run build:lib` and `npm run test:package`: exit 0
- `npm run test:naming`: exit 1, in files this pass does not touch: `scripts/test-package.mjs:180`
  and the Portuguese prose of `DSA-34.md`, `DSA-39.md`, `DSA-42`, `DSA-43`

## Result
The deliverable is complete and open in PR 92, targeting `v/5.0.0`, with review requested from `maurocsjr`.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D4 and D5 wait for Indiane and do not block.

## Next command
Review and merge of PR 92; then close the task with the `review-and-merge` evidence.
