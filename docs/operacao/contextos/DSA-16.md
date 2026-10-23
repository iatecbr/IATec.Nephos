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
The component, CSS and tests; the Validation stories, the Docs page and the dictionary; the
`nph-input` example on the `nph-icon` Docs page; the sheet, the Metadata and P80. The review fixes of Copilot are merged, with
two of them adjusted (Enter at the end of the propagation; the fieldset state kept apart). See
the commits on the branch.

## Commands run
- At `787c9ad`, after the merge of `v/5.0.0` at `9dd6e19` and of the review fixes, with the
  Vite cache cleared: `npm run build:tokens`,
  `test:tokens`, `test`, `typecheck`, `test:i18n`, `test:operacao`, `build-storybook`, `build:lib`,
  `test:package` and `git diff --check`: exit 0
- `npm run test:naming`: exit 1, only in files this pass does not touch:
  `scripts/test-package.mjs:180` and the records of DSA-34, DSA-39, DSA-42, DSA-43, DSA-45 and DSA-47

## Result
The deliverable is complete and open in PR 99, targeting `v/5.0.0`, with review requested from `maurocsjr`.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D1 to D5 wait for Indiane and do not block.

## Next command
Review and merge of PR 99, after the merge of DSA-48; then close the task with the `review-and-merge` evidence.
