```json
{
  "task": "DSA-17",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-17-nph-checkbox-4f2a40",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-checkbox` (component, CSS, stories, Docs page, tests, sheet, P81 and
Metadata) from the contract in the `figma-docs-accepted` evidence, with form participation
and the field contract of P83.

## Sources opened
- `docs/operacao/tarefas/DSA-17.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens of the evidence, rule 6, `tokens_motion`
- `src/components/nph-togglebutton/`, `src/components/nph-toggle-group/` and `src/components/nph-icon/`
- `docs/decisoes-tecnicas.md` — P21, P68, P73, P76

## Changes
The component, CSS and tests; the Validation stories, the Docs page and the dictionary; the
sheet, the Metadata and P81. See the commits on the branch.

## Commands run
After the sync with `v/5.0.0` at `9dd6e19`:
- `npm ci`, `build:tokens`, `test:tokens`, `typecheck`, `test`, `test:i18n`, `test:operacao`,
  `build-storybook`, `build:lib`, `test:package` and `git diff --check`: exit 0
- `npm run test:naming`: exit 1, only in files this pass does not touch

## Result
The branch is ready; the pull request opens after the merge of DSA-28.

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D7 waits for Indiane and does not block.

## Next command
Sync with `v/5.0.0` after the merge of DSA-28, run the proofs again and open the pull request.
