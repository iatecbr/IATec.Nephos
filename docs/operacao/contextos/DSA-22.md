```json
{
  "task": "DSA-22",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-22-nph-togglebutton-60e852",
  "start_sha": "4fec9c0426cafaf29b56cd136781e99b97323f46",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-togglebutton` (component, CSS, stories, Docs page, tests, sheet, P73 and
Metadata) from the contract in the `figma-docs-accepted` evidence.

## Sources opened
- `docs/operacao/tarefas/DSA-22.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence, and the motion rules
- `fichas/nph-skeleton.md`, `fichas/nph-button.md` and `src/components/nph-button/`
- `docs/decisoes-tecnicas.md` — P68, P69 and P70 to P72

## Changes
The component, CSS and tests; the Validation stories, the Docs page and the dictionary;
the sheet, the Metadata and P73. See the commits on the branch.

## Commands run
- `npm ci`, then the baseline proof commands on `v/5.0.0`.
- `npm run build:tokens`, `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:operacao`,
  `build-storybook` and `git diff --check`: exit 0
- `npm run test:naming`: exit 1, only on `DSA-34.md` and `DSA-39.md`, which this pass does not touch

## Result
The deliverable is complete and open in PR 87, targeting `v/5.0.0`, with review requested from `maurocsjr`.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D7 (reduced motion token) waits for Indiane and does not block.

## Next command
Review and merge of PR 87; then close the task with the `review-and-merge` evidence.
