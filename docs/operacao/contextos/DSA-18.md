```json
{
  "task": "DSA-18",
  "worktree": "/Users/elvys.marcos/Projects/IATec/Community/IATec.Nephos/.claude/worktrees/dsa-18-nph-radio-266b51",
  "start_sha": "d00c6ca550e6a0749490a6a67ea39941ee1fa470",
  "end_sha": null
}
```

## Goal of this pass
Implement `nph-radio` (component, CSS, stories, Docs page, tests, sheet, P82 and Metadata)
from the contract in the `figma-docs-accepted` evidence, with the form pattern of P80 and the
field contract of P83.

## Sources opened
- `docs/operacao/tarefas/DSA-18.md` and its evidence
- `docs/operacao/component-handoff.md`, `docs/stories.md`, `fichas/_modelo.md`
- `design.md` — the tokens named in the evidence
- `src/components/nph-togglebutton/` and `src/components/nph-toggle-group/`
- `docs/decisoes-tecnicas.md` — P21, P73, P76, P77; the approved wave rules (P80, P83)

## Changes
The component, CSS and tests; the Validation stories, the Docs page and the dictionary; the
sheet, the Metadata and P82. See the commits on the branch.

## Commands run
After the sync with `v/5.0.0` at `579b2fa` (P80 merged; P82 cites it as written):
- `npm run build:tokens`, `test:tokens`, `typecheck`, `test:i18n`, `test:operacao`,
  `build:lib`, `test:package` (15 components) and `build-storybook`, and `git diff --check`:
  exit 0
- `npm test`: exit 1, only `src/components/nph-tooltip/nph-tooltip.test.ts:1074`, a failure of
  the base that PR 104 fixes; the other 1517 tests pass, the `nph-radio` ones included
- `npm run test:naming`: exit 1, only in files this pass does not touch:
  `scripts/test-package.mjs:180` and the records of DSA-34, 39, 42, 43, 45 and 47

## Result
The branch is ready; the pull request waits for the merge of DSA-28 (P83).

## Evidence
None recorded: `review-and-merge` waits for the PR.

## Blocker
None. D6 and D7 wait for Indiane and do not block.

## Next command
Sync with `v/5.0.0` after DSA-28 merges, run the proofs again and open the PR.
